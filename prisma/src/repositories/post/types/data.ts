/* IMPORTANT: Do NOT modify this file */
import type { Prisma } from '@prisma/client';

export type CommentCreateData = {
  postId: string;
  commenterId: string;
  content: string;
};

export type CommentDeleteData = {
  id: string;
  commenterId: string
};

export type PostCreateData = {
  creatorId: string;
  content: string;
};

export type PostReadSpecificData = {
  id: string;
};

export type PostReadMultipleParameters = Partial<{
  postIds: string[];
  order: Prisma.SortOrder;
}>;

export type PostUpdateData = {
  postId: string;
  creatorId: string;
  newContent: string;
};

export type PostDeleteData = {
  id: string;
  creatorId: string;
};
