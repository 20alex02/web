/* IMPORTANT: Do NOT modify this file */
import type { User } from '@prisma/client';
import prisma from '../client';
import update from './update';

describe('user.update test-suite', () => {
  beforeEach(async () => {
    await prisma.$disconnect();
  });

  const userInEdits: User = {
    id: '35e0e8da-9b01-4ae0-8c81-ac3243033f92',
    userName: 'johnsnowofficial',
    email: 'snow@got.com',
    createdAt: new Date('2023-03-17T12:48:06.000Z'),
    deletedAt: null,
    hashedPassword: '2a6a462fabaf273bc3e03487845abb6b2798df336d1ec410af3e2db0947e168f',
    salt: 'qeymL7Gf69UFbCvWeFWaa3560rwT4doMsf3o6VD4347edoKEfb86kL8fPJ25AT7U1gJ092Ftn0jjBMKZ9T4NMBNSR57IqkPZ76g5W5ph0ivA6yx9FLam2iSS5AVyn9Nj',
    avatar: 'https://pyxis.nymag.com/v1/imgs/bae/9eb/664ad57e704e648661d28a4590b0b176a4-12-jon-snow.2x.rsquare.w536.jpg',
  };

  test('[Success]: Update of an existing active user - email only', async () => {
    const expected: User = {
      ...userInEdits,
      email: 'jonsnow@hbo.com',
    };

    const actual = await update({ id: '35e0e8da-9b01-4ae0-8c81-ac3243033f92', email: 'jonsnow@hbo.com' });
    if (actual.isErr) throw new Error('Repository call should succeed!');

    expect(actual.value).toStrictEqual(expected);
  });

  test('[Success]: Update of an existing active user - username only', async () => {
    const expected: User = {
      ...userInEdits,
      userName: 'jonsnowofficial',
    };

    const actual = await update({ id: '35e0e8da-9b01-4ae0-8c81-ac3243033f92', userName: 'jonsnowofficial' });
    if (actual.isErr) throw new Error('Repository call should succeed!');

    expect(actual.value).toStrictEqual(expected);
  });

  test('[Success]: Update of an existing active user - both email and username', async () => {
    const expected: User = {
      ...userInEdits,
      userName: 'jonsnowofficial',
      email: 'jonsnow@hbo.com',
    };

    const actual = await update({
      id: '35e0e8da-9b01-4ae0-8c81-ac3243033f92',
      userName: 'jonsnowofficial',
      email: 'jonsnow@hbo.com',
    });
    if (actual.isErr) throw new Error('Repository call should succeed!');

    expect(actual.value).toStrictEqual(expected);
  });

  test('[Failure]: Update of a deleted user', async () => {
    const actual = await update({ id: '3c786755-9110-4266-b0e0-a85d9ef0a637', email: 'hello@gmail.com' });

    if (actual.isOk) throw new Error('Repository call should fail!');
    expect(actual.error.message).toBe('The user has already been deleted!');
  });

  test('[Failure]: Update of a non-existing user', async () => {
    const actual = await update({ id: 'this-user-does-not-exist', userName: 'new-awesome-username' });

    if (actual.isOk) throw new Error('Repository call should fail!');
    expect(actual.error.message).toContain('No User found');
  });
});
