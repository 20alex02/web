import { Result } from '@badrap/result';
import prisma from '../../client';
import type { PostDeleteResult } from '../types/return';
import type { PostDeleteData } from '../types/data';

/**
 * @todo Write a query that deletes a post if and only if the creator
 * of the post in mind is the user with the `id` that is passed via arguments.
 * Delete is implemented as setting the `deletedAt` property
 *
 * - The necessary data is provided in the data parameter.
 * - Check the result type to see what needs to be the output that is obtained
 *   by the prisma query.
 *
 * Specification for the result:
 * 1. delete the comments of the post. only delete comments
 *    that have NOT been deleted by the commenters
 *    before the post was taken down by this repository call.
 * 2. only obtain the comments that have been deleted when the post was deleted
 *    (has the same date of deletion as the post) - comments that were still
 *    public when the post was taken down by this repository call.
 * 3. order all fields that obtain multiple records by their required
 *    `createdAt` field in descending order. Order the post history
 *    by the `editedAt` property in descending order.
 * 4. only include "public" information about users in the comments -
 *    date of creation, avatars and user names
 * 5. set both `deletedAt` and `editedAt` of the post to the exact same date
 *    (Date.now() value - use it in a variable defined right before the query
 *    and use it for all `deletedAt` values that you set)
 *
 * Use Prisma's interactive transactions to obtain the post in question and
 * throw an error if the post is not created by the user (with their id)
 * passed as the parameter, or the post does not exist.
 * Then "delete" the post - set the fields `deletedAt` and `editedAt`
 * with **the same** current date and perform a nested update
 * within that same query that "deletes" every non-deleted comment on the post
 * (set `deletedAt` property to the same date as the post's `deletedAt`).
 *
 * Write TWO Prisma queries inside the pre-written transaction
 *
 * Handle the situation where post is not created by the user with id
 * passed in the parameter of the function by throwing with a custom message:
 * 'The user is not the author of this post!'
 *
 * Handle the situation where post has already been deleted by throwing
 * with a custom message:
 * 'The post has already been deleted!'
 *
 * @throws (wrapped in the Result type) when the user with user id provided
 * via the function's parameter is not the post's author, or when the post
 * with id provided via the function's parameter does not exist, or on any
 * unexpected error occurs.
 *
 * @param data - data necessary for post deletion
 * @returns - `Result.ok(Post & {
 * comments: { Comment & { commenter: UserWithoutSensitiveInformation } }[],
 * creator: User,
 * edits: PostEdit[]
 * })` on success
 *          - `Result.err(Error('The user is not the author of this post!'))`
 *            when the user is not the author of the post
 *          - `Result.err(_)` - on all other failures
 *            (`_` meaning the original Prisma error)
 */
const deletePost = async (data: PostDeleteData): PostDeleteResult => {
  const deletedAt = new Date();
  try {
    return Result.ok(
      await prisma.$transaction(async (transaction) => {
        const post = await transaction.post.findUnique({
          where: {
            id: data.id,
          },
        });
        if (post == null) {
          throw new Error('No Post found');
        }
        if (post.creatorId !== data.creatorId) {
          throw new Error('The user is not the author of this post!');
        }
        if (post.deletedAt != null) {
          throw new Error('The post has already been deleted!');
        }
        const updated = await transaction.post.update({
          where: {
            id: data.id,
          },
          data: {
            deletedAt,
            editedAt: deletedAt,
            comments: {
              updateMany: {
                where: {
                  deletedAt: null,
                },
                data: {
                  deletedAt,
                },
              },
            },
          },
          include: {
            creator: true,
            comments: {
              where: {
                deletedAt,
              },
              orderBy: {
                createdAt: 'desc',
              },
              select: {
                id: true,
                createdAt: true,
                content: true,
                commenter: {
                  select: {
                    userName: true,
                    avatar: true,
                    createdAt: true,
                  },
                },
              },
            },
            history: {
              orderBy: {
                editedAt: 'desc',
              },
            },
          },
        });
        return updated;
      }),
    );
  } catch (e) {
    return Result.err(e as Error);
  }
};

export default deletePost;
