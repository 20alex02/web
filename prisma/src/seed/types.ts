/* IMPORTANT: Do NOT modify this file */
/* These are the types of the data from the JSON document */
export type UserJson = {
  id: string;
  userName: string;
  email: string;
  createdAt: string;
  deletedAt?: string;
  hashedPassword: string;
  salt: string;
  avatar: string;
  posts: PostJson[];
};

export type PostJson = {
  id: string;
  createdAt: string;
  editedAt: string;
  deletedAt?: string;
  content: string;
  comments: CommentJson[];
  history: PostEditJson[];
};

export type PostEditJson = {
  id: string;
  editedAt: string;
  content: string;
};

export type CommentJson = {
  id: string;
  commenterId: string;
  createdAt: string;
  deletedAt?: string,
  content: string,
};
