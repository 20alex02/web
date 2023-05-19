/* IMPORTANT: Do NOT modify this file */
import type { Post, User } from '@prisma/client';
import prisma from '../../client';
import create from './create';

describe('post.create test suite', () => {
  beforeEach(async () => {
    await prisma.$disconnect();
  });

  test('[Success]: Create a new post', async () => {
    const expected: Partial<Post & { creator: User }> = {
      content: 'Star Wars sequels were good films!',
      creatorId: 'f27d5290-3b84-4998-834a-f9369fe2b7bd',
      creator: {
        id: 'f27d5290-3b84-4998-834a-f9369fe2b7bd',
        userName: 'big.lightsaber.benkenobi',
        email: 'benkenobi@tatooine.net',
        deletedAt: null,
        createdAt: new Date('2023-03-17T12:51:14.000Z'),
        hashedPassword: 'fd82a6d6ac36da4ce2d22cf64e5ea278b2dd5034e55c430aa9a3e91810e66d26',
        salt: '7ORcF1J57r1bCi4riKX85kVmx58yEkhHpjdDxR1xx62CzB469x4izqevm2bI5VK3U10Ck2yingSVDiF3m8ud7163yN2Z1bA6V7TXP858fSFtzWl27sJ2Q18QQXNw90Jn',
        avatar: 'https://static.wikia.nocookie.net/starwars/images/4/4e/ObiWanHS-SWE.jpg/revision/latest?cb=20111115052816',
      },
    };

    const actual = await create({
      content: 'Star Wars sequels were good films!',
      creatorId: 'f27d5290-3b84-4998-834a-f9369fe2b7bd',
    });

    if (actual.isErr) throw new Error('Repository call should succeed!');
    const actualData = actual.value;

    // post should equal the result we expect
    expect(actualData).toStrictEqual(
      expect.objectContaining({
        ...expected,
      }),
    );

    expect(actualData).toHaveProperty(
      'id',
    );
    expect(actualData).toHaveProperty(
      'createdAt',
    );
    expect(actualData).toHaveProperty(
      'editedAt',
    );
    expect(actualData.createdAt).toStrictEqual(actualData.editedAt);
    expect(actualData.createdAt.getDate()).toBeLessThanOrEqual(Date.now());
    expect(actualData.deletedAt).toBe(
      null,
    );
  });

  test('[Failure]: No user with this id found', async () => {
    const actual = await create({
      content: 'This should fail',
      creatorId: 'because-this-id-does-not-exist',
    });
    if (actual.isOk) throw new Error('Repository call should fail!');
    expect(actual.error.message).toContain('Foreign key constraint failed on the field: `foreign key`');
  });
});
