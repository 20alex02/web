/* IMPORTANT: Do NOT modify this file */
import type { Post, PostEdit, User } from '@prisma/client';
import prisma from '../../client';
import update from './update';

describe('post.update test suite', () => {
  beforeEach(async () => {
    await prisma.$disconnect();
  });

  const postAfterUpdate: Partial<Post> & {
    creator: User,
  } = {
    id: '5bc51c46-7136-4643-9bf2-2031455e0696',
    createdAt: new Date('2023-03-17T19:31:18.000Z'),
    creatorId: 'f27d5290-3b84-4998-834a-f9369fe2b7bd',
    creator: {
      id: 'f27d5290-3b84-4998-834a-f9369fe2b7bd',
      userName: 'big.lightsaber.benkenobi',
      email: 'benkenobi@tatooine.net',
      createdAt: new Date('2023-03-17T12:51:14.000Z'),
      deletedAt: null,
      hashedPassword: 'fd82a6d6ac36da4ce2d22cf64e5ea278b2dd5034e55c430aa9a3e91810e66d26',
      salt: '7ORcF1J57r1bCi4riKX85kVmx58yEkhHpjdDxR1xx62CzB469x4izqevm2bI5VK3U10Ck2yingSVDiF3m8ud7163yN2Z1bA6V7TXP858fSFtzWl27sJ2Q18QQXNw90Jn',
      avatar: 'https://static.wikia.nocookie.net/starwars/images/4/4e/ObiWanHS-SWE.jpg/revision/latest?cb=20111115052816',
    },
    deletedAt: null,
    content: "Game of Thrones Season 8 is (*Read in The Rock's voice*) the biggest piece of dogshit I have ever seen, and that is saying something, as I have seen Anakin burnt to a crisp lmao.",
  };

  const editObject: Partial<PostEdit> = {
    postId: '5bc51c46-7136-4643-9bf2-2031455e0696',
    content: "Game of Thrones Season 8 is (*Read in The Rock's voice*) the biggest piece of dogshit I have ever seen.",
  };

  test('[Success]: Update existing post - with correct author', async () => {
    const actual = await update({
      postId: '5bc51c46-7136-4643-9bf2-2031455e0696',
      creatorId: 'f27d5290-3b84-4998-834a-f9369fe2b7bd',
      newContent: "Game of Thrones Season 8 is (*Read in The Rock's voice*) the biggest piece of dogshit I have ever seen, and that is saying something, as I have seen Anakin burnt to a crisp lmao.",
    });

    if (actual.isErr) throw new Error('Repository call should succeed!');

    expect(actual.value).toStrictEqual(expect.objectContaining({ ...postAfterUpdate }));

    expect(actual.value.history.length).toBe(1);

    const edit = actual.value.history[0];

    if (edit === undefined) throw new Error('The new edit has to be a part of the history');

    expect(edit).toStrictEqual(expect.objectContaining({ ...editObject }));

    expect(edit.editedAt.getDate()).toBeLessThanOrEqual(Date.now());
  });

  test('[Failure]: Update existing post - author not correct', async () => {
    const actual = await update({
      creatorId: '94ba79b3-ede8-4d91-9e72-a9f09b328b92',
      postId: '5bc51c46-7136-4643-9bf2-2031455e0696',
      newContent: 'I need to overtake your account, once and for all KENOBI!!!',
    });

    if (actual.isOk) throw new Error('Repository call should fail!');

    expect(actual.error.message).toBe('The user is not the author of this post!');
  });

  test('[Failure]: Update non-existing post', async () => {
    const actual = await update({
      creatorId: '5bc51c46-7136-4643-9bf2-2031455e0696',
      postId: 'this-post-does-not-exist',
      newContent: 'Neither will this comment',
    });

    if (actual.isOk) throw new Error('Repository call should fail!');

    expect(actual.error.message).toContain('No Post found');
  });

  test('[Failure]: Update deleted post', async () => {
    const actual = await update({
      creatorId: '3c786755-9110-4266-b0e0-a85d9ef0a637',
      postId: '04d6e13e-9600-44f7-b04c-4dc01933d808',
      newContent: 'Unfortunately for me, this operation has been dealt with.',
    });

    if (actual.isOk) throw new Error('Repository call should fail!');

    expect(actual.error.message).toContain('The post has been deleted!');
  });
});
