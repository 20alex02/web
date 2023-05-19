/* IMPORTANT: Do NOT modify this file */
import type {
  Comment, Post, PostEdit, User,
} from '@prisma/client';
import type { AsyncResult } from '../../types';
import type { UserWithoutSensitiveInformation } from '../../user/types/data';

/* We don't want to include the user id in operations */
export type PostAnonymized = {
  id: string;
  createdAt: Date;
  editedAt: Date | null;
  deletedAt: Date | null;
  content: string;
};

export type PostCreateResult = AsyncResult<Post & { creator: User }>;

export type PostUpdateResult = AsyncResult<Post & {
  history: PostEdit[],
  creator: User,
}>;

export type PostDeleteResult = AsyncResult<
Post & Required<PostAdditionalData> & { creator: User }>;

export type CommentWithCommenter = {
  id: string,
  createdAt: Date,
  content: string,
  commenter: UserWithoutSensitiveInformation,
};

export type PostAdditionalData = {
  creator: UserWithoutSensitiveInformation,
  comments: CommentWithCommenter[],
  history: PostEdit[],
};

export type PostReadData = PostAnonymized & {
  comments: CommentWithCommenter[],
} & Partial<PostAdditionalData>;

export type PostReadSpecificResult = AsyncResult<Required<PostReadData>>;

export type PostReadAllResult = AsyncResult<Required<PostReadData[]>>;

export type CommentReturnType = Comment & { post: PostAnonymized, commenter: User };

export type CommentCreateResult = AsyncResult<CommentReturnType>;

export type CommentDeleteResult = AsyncResult<CommentReturnType>;
