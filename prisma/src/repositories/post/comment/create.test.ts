/* IMPORTANT: Do NOT modify this file */
import prisma from '../../client';
import type { CommentReturnType } from '../types/return';
import create from './create';

describe('post.comment.create test suite', () => {
  beforeEach(async () => {
    await prisma.$disconnect();
  });

  const existingUserId = '94ba79b3-ede8-4d91-9e72-a9f09b328b92';
  const existingPostId = '5bc51c46-7136-4643-9bf2-2031455e0696';
  const deletedUserId = '3c786755-9110-4266-b0e0-a85d9ef0a637';
  const deletedPostId = '04d6e13e-9600-44f7-b04c-4dc01933d808';

  test('[Success]: Create comment by an existing user on an existing post', async () => {
    const expected: Partial<CommentReturnType> = {
      postId: '5bc51c46-7136-4643-9bf2-2031455e0696',
      commenterId: '94ba79b3-ede8-4d91-9e72-a9f09b328b92',
      deletedAt: null,
      content: 'To clarify - the series bombed once they ran out of source material.',
      post: {
        id: '5bc51c46-7136-4643-9bf2-2031455e0696',
        createdAt: new Date('2023-03-17T19:31:18.000Z'),
        editedAt: new Date('2023-03-17T19:31:18.000Z'),
        deletedAt: null,
        content: "Game of Thrones Season 8 is (*Read in The Rock's voice*) the biggest piece of dogshit I have ever seen.",
      },
      commenter: {
        id: '94ba79b3-ede8-4d91-9e72-a9f09b328b92',
        userName: 'thedaddy.darthvader',
        email: 'vader@empire.org',
        createdAt: new Date('2023-03-17T12:51:14.000Z'),
        deletedAt: null,
        hashedPassword: '8893aed7540956b6b5308f832771670ee4461853eb08f1cf3871ec0e602e2309',
        salt: 'LeR6fBjGa9WayVmYux9jT33f4AQxkcplRLZWbCJv4g4R7t3LliK0pnUXww2rwdm4f08u4Ffg4Q4N147zpKV4SLtdTY00PJ0qWNuW15KlWrZAWDh99cnH9EN1j8TeKK1J',
        avatar: 'https://www.thedigitalfix.com/wp-content/sites/thedigitalfix/2022/07/Star-Wars-Darth-Vader-explained.jpg',
      },
    };

    const actual = await create({
      postId: existingPostId,
      commenterId: existingUserId,
      content: 'To clarify - the series bombed once they ran out of source material.',
    });

    if (actual.isErr) {
      throw new Error('Repository call should succeed!');
    }

    expect(actual.value).toStrictEqual(expect.objectContaining({ ...expected }));
  });

  test('[Failure]: Create comment by an non-existing user on an existing post', async () => {
    const actual = await create(
      {
        postId: existingPostId,
        commenterId: 'this-user-does-not-exist',
        content: 'random comment',
      },
    );

    if (actual.isOk) throw new Error('Repository call should fail!');
    expect(actual.error.message).toContain('No User found');
  });

  test('[Failure]: Create comment by an existing user on an non-existing post', async () => {
    const actual = await create(
      {
        postId: 'this-post-does-not-exist',
        commenterId: existingUserId,
        content: 'random comment',
      },
    );

    if (actual.isOk) throw new Error('Repository call should fail!');
    expect(actual.error.message).toContain('No Post found');
  });

  test('[Failure]: Create comment by an existing user on a deleted post', async () => {
    const actual = await create(
      {
        postId: deletedPostId,
        commenterId: existingUserId,
        content: 'random comment',
      },
    );

    if (actual.isOk) throw new Error('Repository call should fail!');
    expect(actual.error.message).toBe('The post has been deleted!');
  });

  test('[Failure]: Create comment by a non-existing user on a deleted post', async () => {
    const actual = await create(
      {
        postId: deletedPostId,
        commenterId: 'this-user-does-not-exist',
        content: 'random comment',
      },
    );

    if (actual.isOk) throw new Error('Repository call should fail!');
    expect(actual.error.message).toContain('No User found');
  });

  test('[Failure]: Create comment by an non-existing user on an non-existing post', async () => {
    const actual = await create(
      {
        postId: 'this-post-does-not-exist',
        commenterId: 'this-user-does-not-exist',
        content: 'random comment',
      },
    );

    if (actual.isOk) throw new Error('Repository call should fail!');
    expect(actual.error.message).toContain('No User found');
  });

  test('[Failure]: Create comment by a deleted user on an existing post', async () => {
    const actual = await create(
      {
        postId: existingPostId,
        commenterId: deletedUserId,
        content: 'random comment',
      },
    );

    if (actual.isOk) throw new Error('Repository call should fail!');
    expect(actual.error.message).toContain('The user has been deleted!');
  });

  test('[Failure]: Create comment by a deleted user on an non-existing post', async () => {
    const actual = await create(
      {
        postId: 'this-post-does-not-exist',
        commenterId: deletedUserId,
        content: 'random comment',
      },
    );

    if (actual.isOk) throw new Error('Repository call should fail!');
    expect(actual.error.message).toContain('The user has been deleted!');
  });

  test('[Failure]: Create comment by a deleted user on a deleted post', async () => {
    const actual = await create(
      {
        postId: deletedPostId,
        commenterId: deletedUserId,
        content: 'random comment',
      },
    );

    if (actual.isOk) throw new Error('Repository call should fail!');
    expect(actual.error.message).toContain('The user has been deleted!');
  });
});
