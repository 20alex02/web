import { Result } from '@badrap/result';
import prisma from '../../client';
import type { CommentDeleteData } from '../types/data';
import type { CommentDeleteResult } from '../types/return';

/**
 * @todo Write a query that deletes a comment if and only if the commenter
 * specified by the id in the function's parameter is the author of the comment
 * (also specified in the parameter by its id). Delete is implemented
 * as setting the `deletedAt` property
 *
 * Use Prisma's interactive transactions to obtain the comment in question
 * and throw an error if the comment is not created by the user, or the comment
 * has already been deleted
 *
 * Write TWO Prisma queries and other logic checks inside the pre-written
 * transaction
 *
 * Handle the situation where comment is not created by the user with id
 * passed in the parameter of the function by throwing with a custom message:
 * 'The specified user is not the author of the comment!'
 *
 * Handle the situation where comment has already been deleted by throwing
 * with a custom message:
 * 'The comment has already been deleted!'
 *
 * @throws (wrapped in the Result type) when the user with user id provided
 * via the function's parameter is not the post's author, or when the post
 * with id provided via the function's parameter does not exist,
 * or on any unexpected error
 *
 * @param data - data necessary for comment deletion
 * @returns - `Result.ok(Comment & {
 * post: PostAnonymized,
 * commenter: User,
 * })` on success
 *         - `Result.err(Error('The user is not the author of this comment!'))`
 *           if the user is not the author of this comment
 *         - `Result.err(Error('The comment has already been deleted!'))`
 *           if the comment has already been deleted
 *         - `Result.err(_)` - on all other failures
 *           (`_` meaning the original Prisma error)
 */
const deleteComment = async (data: CommentDeleteData): CommentDeleteResult => {
  try {
    return Result.ok(
      await prisma.$transaction(async (transaction) => {
        const comment = await transaction.comment.findUnique({
          where: {
            id: data.id,
          },
        });
        if (comment == null) {
          throw new Error('No Comment found');
        }
        if (comment.deletedAt != null) {
          throw new Error('The comment has already been deleted!');
        }
        if (data.commenterId !== comment.commenterId) {
          throw new Error('The specified user is not the author of the comment!');
        }
        const updated = await transaction.comment.update({
          where: {
            id: data.id,
          },
          data: {
            deletedAt: new Date(),
          },
          include: {
            commenter: true,
            post: {
              select: {
                id: true,
                createdAt: true,
                editedAt: true,
                deletedAt: true,
                content: true,
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

export default deleteComment;
