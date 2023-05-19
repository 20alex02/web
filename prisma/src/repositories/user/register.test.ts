/* IMPORTANT: Do NOT modify this file */
import prisma from '../client';
import register from './register';
import type { UserRegisterData } from './types/data';

describe('user.register test suite', () => {
  beforeEach(async () => {
    await prisma.$disconnect();
  });

  test('[Success]: User successfully registers', async () => {
    const data: UserRegisterData = {
      userName: 'thehomelander',
      email: 'homelander@vought.com',
      avatar: 'https://www.slashfilm.com/img/gallery/homelanders-season-3-arc-is-a-scary-look-at-our-current-hellscape/l-intro-1654265961.jpg',
      // SHA256 with appended salt. the password is 'icandowhateveriwant'
      hashedPassword: '10745cd9b0f85388c7dcf40453a398085563eff44c95e445c620dfdbdc5b87e6',
      salt: 'uK13jaM1Yn5324SGbOWd6w1juIVu29H2mq3Yl3gVlab7zONjrJooL74suvL0shUQR1f9MBwc38E5n3yk2xGeXasZo3NSP7XbO8Zf3mp0ar9v7n52uuJ00ig6P2ZFT0lj',
    };

    const actual = await register(data);

    if (actual.isErr) throw new Error('Repository call should succeed!');

    expect(actual.value).toHaveProperty('id');
    expect(actual.value).toStrictEqual(expect.objectContaining({ ...data }));
    expect(actual.value.createdAt.getDate()).toBeLessThanOrEqual(Date.now());
    expect(actual.value.deletedAt).toBe(null);
  });

  test('[Failure]: User tries to register with an already used email', async () => {
    const data: UserRegisterData = {
      userName: 'newreggie',
      email: 'reggiexn97@gmail.com',
      avatar: 'https://st.depositphotos.com/2218212/2938/i/600/depositphotos_29387653-stock-photo-facebook-profile.jpg',
      hashedPassword: '135028b09fc097598b9078d5e2ecd4afd285a2712ed68e0be6d43f139533e38b',
      salt: '9TkY9QjaBYI41d1a9I34F9Je4lI4r66s8IGUl1VNMt9g8qAH95Nu3BF5gs49ct1s5oD8TGTY0vseyO5G4GSa8cGT4sUVF3vz8x9pShx77j27P2Ar6Y0x23KXNblcu0y2',
    };

    const actual = await register(data);

    if (actual.isOk) throw new Error('Repository call should fail!');

    expect(actual.error.message).toContain('Unique constraint failed on the fields: (`email`)');
  });

  test('[Failure]: User tries to register with an already used username', async () => {
    const data: UserRegisterData = {
      userName: 'thedaddy.darthvader',
      email: 'vader@galactic.empire.com',
      avatar: 'https://wegotthiscovered.com/wp-content/uploads/2022/07/image1-49.jpg?w=1200',
      hashedPassword: '9baaa24733ea6b56e293772b7b13d530a15561f4557bbfcc4b9c927af72861c9',
      salt: 'A59G43s2NaoZf6M2GeclBp12a27LLEkXKZckO9k3oL8B4Y34zt01BB2J0FnIQ2O7nq2wrJ2Q9yt1Zsay0e3Cc581Yx00g1jQJ4WAJuLWVYWIdmZJLwMXTXEKH7a3oiV1',
    };

    const actual = await register(data);

    if (actual.isOk) throw new Error('Repository call should fail!');

    expect(actual.error.message).toContain('Unique constraint failed on the fields: (`userName`)');
  });
});
