/* IMPORTANT: Do NOT modify this file */
import type { Comment, Post, User } from '@prisma/client';
import type { AsyncResult } from '../../types';
import type { UserWithoutSensitiveInformation } from './data';
import type { PostAnonymized } from '../../post/types/return';

export type UserDeleteType = User & {
  comments: Comment[];
  posts: Post[];
};

export type UserDeleteResult = AsyncResult<UserDeleteType>;

export type UserLoginResult = AsyncResult<{
  id: string;
}>;

export type UserReadSpecificType = {
  userName: string;
  email: string;
  avatar: string;
  createdAt: Date;
  deletedAt?: Date | null;
  posts: PostAnonymized[];
};

export type UserReadSpecificResult = AsyncResult<UserReadSpecificType>;

export type UserReadAllResult = AsyncResult<UserWithoutSensitiveInformation[]>;

export type UserRegisterResult = AsyncResult<User>;

export type UserUpdateResult = AsyncResult<User>;
