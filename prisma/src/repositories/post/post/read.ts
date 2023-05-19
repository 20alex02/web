import { Result } from '@badrap/result';
import prisma from '../../client';
import type { PostReadMultipleParameters as PostReadAllParameters, PostReadSpecificData } from '../types/data';
import type { PostReadAllResult, PostReadSpecificResult } from '../types/return';

/**
 * @todo Write a query that finds a specific post and retrieves information
 * about it
 *
 * Write ONE Prisma query
 *
 * - The necessary data is provided in the data parameter.
 * - Check the result type to see what needs to be the output that is obtained
 *   by the Prisma query.
 *
 * Specification for the result:
 * 1. only obtain the comments that have not been deleted yet
 * 2. order all fields that obtain multiple records by their required
 *    `createdAt` field in descending order. Order the post history
 *    by the `editedAt` property in descending order.
 * 3. only include "public" information about users -
 *    emails, avatars and user names
 *
 * Handle the situation where post does not exist anymore (has the `deletedAt`
 * property) by throwing with a custom message:
 * 'The post does not exist anymore!'
 *
 * @throws (wrapped in the Result type) when the post with the specified id
 * never existed, or when the post was deleted
 *
 * @param data - data necessary for getting the specified post
 * @returns `Result.ok(PostAnonymized & {
 * comments: { Comment & { commenter: UserWithoutSensitiveInformation } }[].
 * creator: UserWithoutSensitiveInformation,
 * history: PostEdit[]
 * })` on success
 *          `Result.err('The post does not exist anymore!')`
 *          when the post has been deleted
 *          `Result.err(_)` - on all other failures
 *          (`_` meaning the original Prisma error)
 */
const specific = async (data: PostReadSpecificData): PostReadSpecificResult => {
  try {
    const post = await prisma.post.findUnique({
      where: {
        id: data.id,
      },
      select: {
        id: true,
        createdAt: true,
        editedAt: true,
        deletedAt: true,
        content: true,
        creator: {
          select: {
            userName: true,
            avatar: true,
            createdAt: true,
          },
        },
        comments: {
          where: {
            deletedAt: null,
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
    if (post == null) {
      throw new Error('No Post found');
    }
    if (post.deletedAt != null) {
      throw new Error('The post does not exist anymore!');
    }
    return Result.ok(post);
  } catch (e) {
    return Result.err(e as Error);
  }
};

/**
 * @todo Write a query that finds multiple posts
 * (further specified by the parameters of this function)
 *
 * Write only ONE Prisma query
 *
 * Parametes can change whether we look for specific posts only, or all posts,
 * as well as ordering of the posts by their date of creation
 * (by default descending)
 *
 * Specification for the result:
 * 1. only retrieve the posts, which have not been deleted yet
 * 2. only obtain the post comments, that have not been deleted yet
 * 3. order all fields that obtain multiple records by their required date
 *    field in descending order, unless the parameter overrides this
 * 4. only include "public" information about users in the comments -
 *    emails, avatars and user names
 *
 * @throws on any unexpected error (automatically handled by Prisma)
 *
 * @param parameters - optional parameters changing the query
 * @returns - `Result.ok(PostAnonymized & {
 * comments: { Comment & { commenter: UserWithoutSensitiveInformation } }[]
 * })` on success
 *          - `Result.err(_)` - on all failures
 *            (`_` meaning the original Prisma error)
 */
export const all = async (parameters?: PostReadAllParameters): PostReadAllResult => {
  try {
    const posts = await prisma.post.findMany({
      where: {
        deletedAt: null,
        id: parameters?.postIds != null ? { in: parameters.postIds } : { notIn: [] },
      },
      orderBy: {
        createdAt: parameters?.order ?? 'desc',
      },
      select: {
        id: true,
        createdAt: true,
        editedAt: true,
        deletedAt: true,
        content: true,
        creator: {
          select: {
            userName: true,
            avatar: true,
            createdAt: true,
          },
        },
        comments: {
          where: {
            deletedAt: null,
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
      },
    });
    return Result.ok(posts);
  } catch (e) {
    return Result.err(e as Error);
  }
};

const read = {
  all,
  specific,
};

export default read;
