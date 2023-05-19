/* IMPORTANT: Do NOT modify this file */
import prisma from '../client';
import read from './read';
import type { UserWithoutSensitiveInformation } from './types/data';
import type { UserReadSpecificType } from './types/return';

describe('user.read.specific test suite', () => {
  beforeEach(async () => {
    await prisma.$disconnect();
  });

  const userExisting: UserReadSpecificType = {
    userName: 'jeremiah.hill',
    email: 'j.hill@scada.org',
    createdAt: new Date('2023-03-17T13:00:06.000Z'),
    deletedAt: null,
    avatar: 'https://upload.wikimedia.org/wikipedia/commons/5/59/User-avatar.svg',
    posts: [
      {
        id: '6499019c-37c5-4d24-b48e-e2484bb3e68a',
        createdAt: new Date('2023-03-17T13:18:26.000Z'),
        deletedAt: null,
        editedAt: new Date('2023-03-17T13:29:11.000Z'),
        content: 'NEW Star Wars is mid. Here! I said it!!!',
      },
    ],
  };

  test('[Success]: Read info about an existing user', async () => {
    const expected = userExisting;

    const actual = await read.specific({ userName: 'jeremiah.hill' });

    if (actual.isErr) throw new Error('Repository call should succeed!');
    expect(actual.value).toStrictEqual(expected);
  });

  test('[Fail]: Read info about a deleted user', async () => {
    const actual = await read.specific({ userName: 'xn97reginald' });

    if (actual.isOk) throw new Error('Repository call should fail!');

    expect(actual.error.message).toBe('The user has been deleted!');
  });

  test('[Fail]: Read info about a non-existing user', async () => {
    const actual = await read.specific({ userName: 'not-an-existing-user' });

    if (actual.isOk) throw new Error('Repository call should fail!');

    expect(actual.error.message).toContain('No User found');
  });
});

describe('user.read.all test suite', () => {
  beforeEach(async () => {
    await prisma.$disconnect();
  });

  const allUsers: UserWithoutSensitiveInformation[] = [
    {
      userName: 'jimmy.smith',
      avatar: 'https://lh6.googleusercontent.com/-UYKv4Oo4AL4/AAAAAAAAAAI/AAAAAAAAAAA/ACHi3reOcBoiruxfuiRHs8VAoE-HvgnBDw/mo/photo.jpg?sz=256',
      createdAt: new Date('2023-03-17T17:16:39.000Z'),
    },
    {
      userName: 'jeremiah.hill',
      avatar: 'https://upload.wikimedia.org/wikipedia/commons/5/59/User-avatar.svg',
      createdAt: new Date('2023-03-17T13:00:06.000Z'),
    },
    {
      userName: 'big.lightsaber.benkenobi',
      avatar: 'https://static.wikia.nocookie.net/starwars/images/4/4e/ObiWanHS-SWE.jpg/revision/latest?cb=20111115052816',
      createdAt: new Date('2023-03-17T12:51:14.000Z'),
    },
    {
      userName: 'thedaddy.darthvader',
      avatar: 'https://www.thedigitalfix.com/wp-content/sites/thedigitalfix/2022/07/Star-Wars-Darth-Vader-explained.jpg',
      createdAt: new Date('2023-03-17T12:51:14.000Z'),
    },
    {
      userName: 'johnsnowofficial',
      avatar: 'https://pyxis.nymag.com/v1/imgs/bae/9eb/664ad57e704e648661d28a4590b0b176a4-12-jon-snow.2x.rsquare.w536.jpg',
      createdAt: new Date('2023-03-17T12:48:06.000Z'),
    },
  ];

  test('[Success]: Read all users ', async () => {
    const expected = allUsers;

    const actual = await read.all();

    if (actual.isErr) throw new Error('Repository call should succeed!');
    expect(actual.value).toStrictEqual(expected);
  });

  test('[Success]: Read selected users', async () => {
    const expected = allUsers.slice(0, 3);

    const actual = await read.all({
      userNames: [
        'jimmy.smith',
        'jeremiah.hill',
        'big.lightsaber.benkenobi',
      ],
    });

    if (actual.isErr) throw new Error('Repository call should succeed!');
    expect(actual.value).toStrictEqual(expected);
  });

  test('[Success]: Read all users changed order', async () => {
    const expected = [
      {
        userName: 'johnsnowofficial',
        avatar: 'https://pyxis.nymag.com/v1/imgs/bae/9eb/664ad57e704e648661d28a4590b0b176a4-12-jon-snow.2x.rsquare.w536.jpg',
        createdAt: new Date('2023-03-17T12:48:06.000Z'),
      },
      {
        userName: 'big.lightsaber.benkenobi',
        avatar: 'https://static.wikia.nocookie.net/starwars/images/4/4e/ObiWanHS-SWE.jpg/revision/latest?cb=20111115052816',
        createdAt: new Date('2023-03-17T12:51:14.000Z'),
      },
      {
        userName: 'thedaddy.darthvader',
        avatar: 'https://www.thedigitalfix.com/wp-content/sites/thedigitalfix/2022/07/Star-Wars-Darth-Vader-explained.jpg',
        createdAt: new Date('2023-03-17T12:51:14.000Z'),
      },
      {
        userName: 'jeremiah.hill',
        avatar: 'https://upload.wikimedia.org/wikipedia/commons/5/59/User-avatar.svg',
        createdAt: new Date('2023-03-17T13:00:06.000Z'),
      },
      {
        userName: 'jimmy.smith',
        avatar: 'https://lh6.googleusercontent.com/-UYKv4Oo4AL4/AAAAAAAAAAI/AAAAAAAAAAA/ACHi3reOcBoiruxfuiRHs8VAoE-HvgnBDw/mo/photo.jpg?sz=256',
        createdAt: new Date('2023-03-17T17:16:39.000Z'),
      },
    ];
    const actual = await read.all({ order: 'asc' });

    if (actual.isErr) throw new Error('Repository call should succeed!');
    expect(actual.value).toStrictEqual(expected);
  });

  test('[Success]: Read selected users changed order', async () => {
    const expected = [
      {
        userName: 'big.lightsaber.benkenobi',
        avatar: 'https://static.wikia.nocookie.net/starwars/images/4/4e/ObiWanHS-SWE.jpg/revision/latest?cb=20111115052816',
        createdAt: new Date('2023-03-17T12:51:14.000Z'),
      },
      {
        userName: 'jeremiah.hill',
        avatar: 'https://upload.wikimedia.org/wikipedia/commons/5/59/User-avatar.svg',
        createdAt: new Date('2023-03-17T13:00:06.000Z'),
      },
      {
        userName: 'jimmy.smith',
        avatar: 'https://lh6.googleusercontent.com/-UYKv4Oo4AL4/AAAAAAAAAAI/AAAAAAAAAAA/ACHi3reOcBoiruxfuiRHs8VAoE-HvgnBDw/mo/photo.jpg?sz=256',
        createdAt: new Date('2023-03-17T17:16:39.000Z'),
      }];

    const actual = await read.all({
      order: 'asc',
      userNames: [
        'jimmy.smith',
        'jeremiah.hill',
        'big.lightsaber.benkenobi',
      ],
    });

    if (actual.isErr) throw new Error('Repository call should succeed!');
    expect(actual.value).toStrictEqual(expected);
  });

  test('[Success]: Read non valid id(\'s) returns empty list', async () => {
    const expected: UserWithoutSensitiveInformation[] = [];

    const actual = await read.all({
      userNames: [
        'none-of-these',
        'should-be-in-the-db',
      ],
    });

    if (actual.isErr) throw new Error('Repository call should succeed!');
    expect(actual.value).toStrictEqual(expected);
  });
});
