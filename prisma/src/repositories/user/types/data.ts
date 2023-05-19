/* IMPORTANT: Do NOT modify this file */
import type { Prisma } from '@prisma/client';

export type UserDeleteData = {
  id: string;
};

export type UserLoginData = {
  email: string;
  /*
   * Here would the hash & password of the password
   * which would be obtained (implemented) somehow.
   * for our purpose, it is not important right now
   */
};

export type UserWithoutSensitiveInformation = {
  userName: string;
  avatar: string;
  createdAt: Date;
};

export type UserReadSpecificData = {
  userName: string;
};

export type UserReadAllParameters = Partial<{
  userNames: string[];
  order: Prisma.SortOrder;
}>;

export type UserRegisterData = {
  userName: string;
  email: string;
  hashedPassword: string;
  salt: string;
  avatar: string;
};

export type UserUpdateData = {
  id: string;
} & (
  {
    email: string;
    userName: string;
  }
  | { email: string }
  | { userName: string }
);
