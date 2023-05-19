/* IMPORTANT: Do NOT modify this file */
import type { Post } from '@prisma/client';
import prisma from '../client';
import deleteUser from './delete';
import type { UserDeleteType } from './types/return';

describe('user.delete test suite', () => {
  beforeEach(async () => {
    await prisma.$disconnect();
  });

  test('[Success]: Deleting an existing user', async () => {
    const expectedUser: Partial<UserDeleteType> = {
      id: '772fff42-12ed-4a30-b981-ab0bc73fde73',
      userName: 'jeremiah.hill',
      email: 'j.hill@scada.org',
      createdAt: new Date('2023-03-17T13:00:06.000Z'),
      hashedPassword: '9f45cd50672132537264050cd666e6ae5dcc00de78361c2ecdbb6d1847cfe63e',
      salt: 'JOA0c7xtMB7pV4oPCjnG1djDo7wbhn16zsreKt7wKnOd4o9mXSDg7q2hnX7858ONB2JPg6Y4WR4ambujo175Af6UCKVR3495AE92r47BL5q5nKl6DM802dwI5w85b4JJ',
      avatar: 'https://upload.wikimedia.org/wikipedia/commons/5/59/User-avatar.svg',
      comments: [],
    };
    const expectedPostInUser: Partial<Post> = {
      id: '6499019c-37c5-4d24-b48e-e2484bb3e68a',
      creatorId: '772fff42-12ed-4a30-b981-ab0bc73fde73',
      createdAt: new Date('2023-03-17T13:18:26.000Z'),
      content: 'NEW Star Wars is mid. Here! I said it!!!',
    };

    const actual = await deleteUser({
      id: '772fff42-12ed-4a30-b981-ab0bc73fde73',
    });

    if (actual.isErr) throw new Error('Repository call should succeed!');

    expect(actual.value).toStrictEqual(
      expect.objectContaining({ ...expectedUser }),
    );

    expect(actual.value.deletedAt).not.toBe(null);

    expect(actual.value.deletedAt?.getDate()).toBeLessThanOrEqual(Date.now());

    expect(actual.value.posts.length).toBe(1);

    expect(actual.value.posts[0]).toStrictEqual(
      expect.objectContaining({ ...expectedPostInUser }),
    );

    expect(actual.value.posts[0]?.editedAt).toEqual(actual.value.posts[0]?.deletedAt);

    expect(actual.value.deletedAt).toEqual(actual.value.posts[0]?.deletedAt);

    expect(actual.value.comments.length).toEqual(0);
  });

  test('[Failure]: Deleting a deleted user', async () => {
    const actual = await deleteUser({ id: '3c786755-9110-4266-b0e0-a85d9ef0a637' });

    if (actual.isOk) throw new Error('Repository call should fail!');
    expect(actual.error.message).toBe('The user has already been deleted!');
  });

  test('[Failure]: Deleting a non-existing user', async () => {
    const actual = await deleteUser({ id: 'this-user-does-not-exist' });

    if (actual.isOk) throw new Error('Repository call should fail!');
    expect(actual.error.message).toContain('No User found');
  });
});
