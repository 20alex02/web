/* IMPORTANT: Do NOT modify this file */
/* eslint-disable no-console */
import prisma from '../repositories/client';
import data from '../../data/social_network_data.json';
import type { PostJson, UserJson } from './types';

// Create user queries
const userCreateQueries = data.users.map(
  ({ posts, ...user }: UserJson) => prisma.user.create({
    data: {
      ...user,
    },
  }),
);

// create post queries with nested writes (thanks to the Prisma's awesome API)
const postCreateQueries = data.users.flatMap(
  ({ posts, ...user }: UserJson) => posts.map(
    ({ history, comments, ...post }: PostJson) => prisma.post.create({
      data: {
        ...post,
        creatorId: user.id,
        history: {
          create: history,
        },
        comments: {
          create: comments,
        },
      },
    }),
  ),
);

const seed = async () => {
  console.log(`[${new Date(Date.now()).toISOString()}]: Seeding started`);
  try {
    await prisma.$transaction([
      ...userCreateQueries,
      ...postCreateQueries,
    ]);

    console.log(`[${new Date(Date.now()).toISOString()}]: Seeding succesful!`);
  } catch (e) {
    console.log(e);
    console.log(`[${new Date(Date.now()).toISOString()}]: Seeding was not successful. Aborting!`);
  }
};

seed();
