/* IMPORTANT: Do NOT modify this file */
import type { Post, User } from '@prisma/client';
import prisma from '../../client';
import type { PostAdditionalData } from '../types/return';
import deletePost from './delete';

describe('post.delete test suite', () => {
  beforeEach(async () => {
    await prisma.$disconnect();
  });

  test('[Success]: existing post with correct user id', async () => {
    const expected: Partial<(Post
    & Required<PostAdditionalData>
    & { creator: User })> = {
      id: '05876232-dc44-4f04-87a0-ebb691958729',
      createdAt: new Date('2023-03-17T18:27:09.000Z'),
      creatorId: '91ed64ab-b393-4911-a37f-c9d20e812e44',
      creator: {
        id: '91ed64ab-b393-4911-a37f-c9d20e812e44',
        userName: 'jimmy.smith',
        email: 'smithy69420@gmail.com',
        createdAt: new Date('2023-03-17T17:16:39.000Z'),
        deletedAt: null,
        hashedPassword: '9b43f9881be027aec4baefbc13de34ae46e42d481b59c5c8228059431f39de40',
        salt: 'NDf5d0rvYkzk1V4AnIrnHG60QR3RZD6PQ3qPyFFg0t688ZKlpO548vuN0oZs63dvsVzRoH9rHgS9GiFJY2cm2p3F5GBqFgn0b5ZBfFr1W6GwwLwyXL67V0Hd9MoV8788',
        avatar: 'https://lh6.googleusercontent.com/-UYKv4Oo4AL4/AAAAAAAAAAI/AAAAAAAAAAA/ACHi3reOcBoiruxfuiRHs8VAoE-HvgnBDw/mo/photo.jpg?sz=256',
      },
      content: 'Can we talk about the political and economic state of the world right now?',
      history: [
        {
          id: 'fc7d8519-3754-4d04-aa3a-d4ab0846dd08',
          postId: '05876232-dc44-4f04-87a0-ebb691958729',
          editedAt: new Date('2023-03-17T18:36:41.000Z'),
          content: 'Can we talk about the world politics?',
        },
        {
          id: '3bae9796-0f9b-4404-ab40-47b69c2112ed',
          postId: '05876232-dc44-4f04-87a0-ebb691958729',
          editedAt: new Date('2023-03-17T18:27:09.000Z'),
          content: 'Can we talk about the world?',
        },
      ],
      comments: [
        {
          id: 'e7e3bec9-af3e-4cdd-bbc9-3088952f5b1a',
          createdAt: new Date('2023-03-17T18:52:13.000Z'),
          content: 'Anyone? Please... :(',
          commenter: {
            userName: 'jimmy.smith',
            avatar: 'https://lh6.googleusercontent.com/-UYKv4Oo4AL4/AAAAAAAAAAI/AAAAAAAAAAA/ACHi3reOcBoiruxfuiRHs8VAoE-HvgnBDw/mo/photo.jpg?sz=256',
            createdAt: new Date('2023-03-17T17:16:39.000Z'),
          },
        },
      ],
    };

    const actual = await deletePost({ id: '05876232-dc44-4f04-87a0-ebb691958729', creatorId: '91ed64ab-b393-4911-a37f-c9d20e812e44' });

    if (actual.isErr) throw new Error('Repository call should succeed!');

    expect(actual.value).toStrictEqual(
      expect.objectContaining(expected),
    );

    expect(actual.value.deletedAt).not.toBeNull();
    expect(actual.value.deletedAt?.getDate()).toBeLessThanOrEqual(Date.now());
    expect(actual.value.editedAt).toEqual(actual.value.deletedAt);

    expect(actual.value.comments.length).toEqual(1);
    expect(actual.value.history.length).toEqual(2);
  });

  test('[Success]: existing post with correct user id - NOT including previously deleted comments', async () => {
    const expected: Partial<(Post
    & Required<PostAdditionalData>
    & { creator: User })> = {
      id: '6499019c-37c5-4d24-b48e-e2484bb3e68a',
      creator: {
        id: '772fff42-12ed-4a30-b981-ab0bc73fde73',
        userName: 'jeremiah.hill',
        email: 'j.hill@scada.org',
        createdAt: new Date('2023-03-17T13:00:06.000Z'),
        deletedAt: null,
        hashedPassword: '9f45cd50672132537264050cd666e6ae5dcc00de78361c2ecdbb6d1847cfe63e',
        salt: 'JOA0c7xtMB7pV4oPCjnG1djDo7wbhn16zsreKt7wKnOd4o9mXSDg7q2hnX7858ONB2JPg6Y4WR4ambujo175Af6UCKVR3495AE92r47BL5q5nKl6DM802dwI5w85b4JJ',
        avatar: 'https://upload.wikimedia.org/wikipedia/commons/5/59/User-avatar.svg',
      },
      createdAt: new Date('2023-03-17T13:18:26.000Z'),
      creatorId: '772fff42-12ed-4a30-b981-ab0bc73fde73',
      content: 'NEW Star Wars is mid. Here! I said it!!!',
      history: [
        {
          id: 'aac78725-541b-4ff1-b52a-e8af29d8a0b0',
          editedAt: new Date('2023-03-17T13:18:26.000Z'),
          postId: '6499019c-37c5-4d24-b48e-e2484bb3e68a',
          content: 'Star Wars is mid. Here! I said it!!!',
        },
      ],
      comments: [
        {
          id: 'c7752cca-1d46-4670-a7cd-7fb38c4d3dc7',
          commenter: {
            userName: 'johnsnowofficial',
            avatar: 'https://pyxis.nymag.com/v1/imgs/bae/9eb/664ad57e704e648661d28a4590b0b176a4-12-jon-snow.2x.rsquare.w536.jpg',
            createdAt: new Date('2023-03-17T12:48:06.000Z'),
          },
          createdAt: new Date('2023-03-17T13:30:11.000Z'),
          content: 'I agree with you.',
        },
        {
          id: '89f4f975-9cef-4a57-9306-e5add4f016ec',
          commenter: {
            userName: 'thedaddy.darthvader',
            avatar: 'https://www.thedigitalfix.com/wp-content/sites/thedigitalfix/2022/07/Star-Wars-Darth-Vader-explained.jpg',
            createdAt: new Date('2023-03-17T12:51:14.000Z'),
          },
          createdAt: new Date('2023-03-17T13:26:40.000Z'),
          content: 'Wack take.',
        },
      ],
    };

    const actual = await deletePost({ id: '6499019c-37c5-4d24-b48e-e2484bb3e68a', creatorId: '772fff42-12ed-4a30-b981-ab0bc73fde73' });

    expect(actual.isOk).toBe(true);

    if (actual.isErr) throw new Error('Repository call should succeed!');

    expect(actual.value).toStrictEqual(
      expect.objectContaining(expected),
    );

    expect(actual.value.deletedAt).not.toBeNull();
    expect(actual.value.deletedAt?.getDate()).toBeLessThanOrEqual(Date.now());
    expect(actual.value.editedAt).toEqual(actual.value.deletedAt);

    expect(actual.value.comments.length).toEqual(2);
    expect(actual.value.history.length).toEqual(1);
  });

  test('[Failure]: Incorrect user id', async () => {
    const actual = await deletePost({ id: '05876232-dc44-4f04-87a0-ebb691958729', creatorId: 'not-an-actual-existing-id' });
    expect(actual.isErr).toBe(true);
    if (actual.isOk) throw new Error('Repository call should fail!');
    expect(actual.error.message).toBe('The user is not the author of this post!');
  });

  test('[Failure]: Incorrect post id', async () => {
    const actual = await deletePost({ id: 'not-an-actual-existing-id', creatorId: '91ed64ab-b393-4911-a37f-c9d20e812e44' });
    expect(actual.isErr).toBe(true);
    if (actual.isOk) throw new Error('Repository call should fail!');
    expect(actual.error.message).toContain('No Post found');
  });

  test('[Failure]: Post already deleted', async () => {
    const actual = await deletePost({ id: '04d6e13e-9600-44f7-b04c-4dc01933d808', creatorId: '3c786755-9110-4266-b0e0-a85d9ef0a637' });
    expect(actual.isErr).toBe(true);
    if (actual.isOk) throw new Error('Repository call should fail!');
    expect(actual.error.message).toBe('The post has already been deleted!');
  });
});
