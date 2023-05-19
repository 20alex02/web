import { Result } from '@badrap/result';
import prisma from '../client';
import type { UserLoginResult } from './types/return';
import type { UserLoginData } from './types/data';

/**
 * @todo Write a query that "logs in" the user - retrieves user's `id`
 *
 * In real world, you would use the password's hash and the generated salt
 * to check, whether the hashed and salted user's input matches the hash
 * retrieved from the database. This would be done with a transaction.
 * For now, only a simple query suffices as this is not a demo of
 * how to do auth. It is just a function, that should
 * be implemented in the repository.
 *
 * Write only ONE Prisma query
 *
 *
 * @throws (wrapped by the Result type) when the user with specified
 * email address does not exist, or on any unexpected error
 *
 * @param data - email address
 * @returns - `Result.ok({ id: string })` on success
 *          - `Result.err(Error('The user has been deleted!'))`
 *            if the user has been deleted
 *          - `Result.err(_)` - on all other failures
 *            (`_` meaning the original Prisma error)
 */
const login = async (data: UserLoginData): UserLoginResult => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        email: data.email,
      },
    });
    if (user == null) {
      throw new Error('No User found');
    }
    if (user.deletedAt != null) {
      throw new Error('The user has been deleted!');
    }
    return Result.ok({ id: user.id });
  } catch (e) {
    return Result.err(e as Error);
  }
};

export default login;
