/* IMPORTANT: Do NOT modify this file */
import prisma from '../client';
import login from './login';

describe('user.login test suite', () => {
  beforeEach(async () => {
    await prisma.$disconnect();
  });

  test('[Success]: User with the correct email address logs in', async () => {
    const expected = { id: '772fff42-12ed-4a30-b981-ab0bc73fde73' };
    const actual = await login({ email: 'j.hill@scada.org' });

    if (actual.isErr) throw new Error('Repository call should succeed!');

    expect(actual.value).toStrictEqual(expected);
  });

  test('[Failure]: Non-exisiting user logs in with the address', async () => {
    const actual = await login({ email: 'no-email-like-this-exists@gmail.com' });

    if (actual.isOk) throw new Error('Repository call should fail!');

    expect(actual.error.message).toContain('No User found');
  });

  test('[Failure]: Existing deleted user logs in', async () => {
    const actual = await login({ email: 'reggiexn97@gmail.com' });

    if (actual.isOk) throw new Error('Repository call should fail!');

    expect(actual.error.message).toBe('The user has been deleted!');
  });
});
