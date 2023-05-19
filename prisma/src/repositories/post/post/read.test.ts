/* IMPORTANT: Do NOT modify this file */
import prisma from '../../client';
import type { PostReadData } from '../types/return';
import read from './read';

describe('post.read.specific test suite', () => {
  beforeEach(async () => {
    await prisma.$disconnect();
  });

  const postSpecific: Required<PostReadData> = {
    id: '6499019c-37c5-4d24-b48e-e2484bb3e68a',
    creator: {
      userName: 'jeremiah.hill',
      avatar: 'https://upload.wikimedia.org/wikipedia/commons/5/59/User-avatar.svg',
      createdAt: new Date('2023-03-17T13:00:06.000Z'),
    },
    createdAt: new Date('2023-03-17T13:18:26.000Z'),
    editedAt: new Date('2023-03-17T13:29:11.000Z'),
    deletedAt: null,
    content: 'NEW Star Wars is mid. Here! I said it!!!',
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
    history: [
      {
        id: 'aac78725-541b-4ff1-b52a-e8af29d8a0b0',
        postId: '6499019c-37c5-4d24-b48e-e2484bb3e68a',
        editedAt: new Date('2023-03-17T13:18:26.000Z'),
        content: 'Star Wars is mid. Here! I said it!!!',
      },
    ],
  };

  const postSpecificHistoryOrder: Required<PostReadData> = {
    id: '05876232-dc44-4f04-87a0-ebb691958729',
    createdAt: new Date('2023-03-17T18:27:09.000Z'),
    editedAt: new Date('2023-03-17T18:40:09.000Z'),
    deletedAt: null,
    creator: {
      userName: 'jimmy.smith',
      avatar: 'https://lh6.googleusercontent.com/-UYKv4Oo4AL4/AAAAAAAAAAI/AAAAAAAAAAA/ACHi3reOcBoiruxfuiRHs8VAoE-HvgnBDw/mo/photo.jpg?sz=256',
      createdAt: new Date('2023-03-17T17:16:39.000Z'),
    },
    content: 'Can we talk about the political and economic state of the world right now?',
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
  };

  test('[Success]: Read a valid post', async () => {
    const expected = postSpecific;

    const actual = await read.specific({ id: '6499019c-37c5-4d24-b48e-e2484bb3e68a' });
    if (actual.isErr) throw new Error('Repository call should succeed!');
    expect(actual.value).toStrictEqual(expected);
  });

  test('[Success]: Read a valid post - check history order', async () => {
    const expected = postSpecificHistoryOrder;

    const actual = await read.specific({ id: '05876232-dc44-4f04-87a0-ebb691958729' });
    if (actual.isErr) throw new Error('Repository call should succeed!');
    expect(actual.value).toStrictEqual(expected);
  });

  test('[Failure]: Post does not exist anymore', async () => {
    const actual = await read.specific({ id: '04d6e13e-9600-44f7-b04c-4dc01933d808' });
    if (actual.isOk) throw new Error('Repository call should fail!');
    expect(actual.error.message).toBe('The post does not exist anymore!');
  });

  test('[Failure]: Post never existed', async () => {
    const actual = await read.specific({ id: 'this-post-never-existed' });
    if (actual.isOk) throw new Error('Repository call should fail!');
    expect(actual.error.message).toContain('No Post found');
  });
});

describe('post.read.all test suite', () => {
  beforeEach(async () => {
    await prisma.$disconnect();
  });

  const allValidPostsDefault: PostReadData[] = [
    {
      id: '5bc51c46-7136-4643-9bf2-2031455e0696',
      createdAt: new Date('2023-03-17T19:31:18.000Z'),
      editedAt: new Date('2023-03-17T19:31:18.000Z'),
      creator: {
        userName: 'big.lightsaber.benkenobi',
        avatar: 'https://static.wikia.nocookie.net/starwars/images/4/4e/ObiWanHS-SWE.jpg/revision/latest?cb=20111115052816',
        createdAt: new Date('2023-03-17T12:51:14.000Z'),
      },
      deletedAt: null,
      content: "Game of Thrones Season 8 is (*Read in The Rock's voice*) the biggest piece of dogshit I have ever seen.",
      comments: [
        {
          id: 'a4ab6f52-5de4-4171-b630-86a04e62b059',
          commenter: {
            userName: 'johnsnowofficial',
            avatar: 'https://pyxis.nymag.com/v1/imgs/bae/9eb/664ad57e704e648661d28a4590b0b176a4-12-jon-snow.2x.rsquare.w536.jpg',
            createdAt: new Date('2023-03-17T12:48:06.000Z'),
          },
          createdAt: new Date('2023-03-17T21:04:39.000Z'),
          content: 'I unfortunately have to agree. Fr fr no cap.',
        },
      ],
    },
    {
      id: '05876232-dc44-4f04-87a0-ebb691958729',
      createdAt: new Date('2023-03-17T18:27:09.000Z'),
      editedAt: new Date('2023-03-17T18:40:09.000Z'),
      deletedAt: null,
      creator: {
        userName: 'jimmy.smith',
        avatar: 'https://lh6.googleusercontent.com/-UYKv4Oo4AL4/AAAAAAAAAAI/AAAAAAAAAAA/ACHi3reOcBoiruxfuiRHs8VAoE-HvgnBDw/mo/photo.jpg?sz=256',
        createdAt: new Date('2023-03-17T17:16:39.000Z'),
      },
      content: 'Can we talk about the political and economic state of the world right now?',
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
    },
    {
      id: '6499019c-37c5-4d24-b48e-e2484bb3e68a',
      creator: {
        userName: 'jeremiah.hill',
        avatar: 'https://upload.wikimedia.org/wikipedia/commons/5/59/User-avatar.svg',
        createdAt: new Date('2023-03-17T13:00:06.000Z'),
      },
      createdAt: new Date('2023-03-17T13:18:26.000Z'),
      editedAt: new Date('2023-03-17T13:29:11.000Z'),
      deletedAt: null,
      content: 'NEW Star Wars is mid. Here! I said it!!!',
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
    },
  ];

  test('[Success]: Read all valid posts - only has specified information (no deleted posts, no deleted comments)', async () => {
    const expected = allValidPostsDefault;

    const actual = await read.all();
    if (actual.isErr) throw new Error('Repository call should succeed!');
    expect(actual.value).toStrictEqual<PostReadData[]>(expected);
  });

  test('[Success]: Read valid posts - using a range of ID\'s', async () => {
    const expected = allValidPostsDefault.slice(0, 2);

    const actual = await read.all({ postIds: ['5bc51c46-7136-4643-9bf2-2031455e0696', '05876232-dc44-4f04-87a0-ebb691958729'] });
    if (actual.isErr) throw new Error('Repository call should succeed!');
    expect(actual.value).toStrictEqual<PostReadData[]>(expected);
  });

  test('[Success]: Read valid posts - using different ordering', async () => {
    const expected = [...allValidPostsDefault].reverse();

    const actual = await read.all({ order: 'asc' });
    if (actual.isErr) throw new Error('Repository call should succeed!');
    expect(actual.value).toStrictEqual<PostReadData[]>(expected);
  });

  test('[Success]: Read valid posts - using different ordering and a range of ID\'s', async () => {
    const expected = [...allValidPostsDefault.slice(0, 2)].reverse();

    const actual = await read.all({ postIds: ['5bc51c46-7136-4643-9bf2-2031455e0696', '05876232-dc44-4f04-87a0-ebb691958729'], order: 'asc' });
    if (actual.isErr) throw new Error('Repository call should succeed!');
    expect(actual.value).toStrictEqual<PostReadData[]>(expected);
  });

  test('[Success]: Read non valid id(\'s) returns empty list', async () => {
    const expected: PostReadData[] = [];

    const actual = await read.all({ postIds: ['these-ids', 'should-retrieve-no-posts'] });
    if (actual.isErr) throw new Error('Repository call should succeed!');
    expect(actual.value).toStrictEqual<PostReadData[]>(expected);
  });
});
