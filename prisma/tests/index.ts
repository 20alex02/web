/* IMPORTANT: Do NOT modify this file */
import fs from 'fs/promises';
import path from 'node:path';

// backup of user data
global.beforeAll(async () => {
  await fs.copyFile(
    path.join(__dirname, '/../prisma/database.db'),
    path.join(__dirname, '/../prisma/database.backup.db'),
  );
});

// use the test database as the database in prisma,
// always use a fresh copy
global.beforeEach(async () => {
  await fs.copyFile(
    path.join(__dirname, '/../prisma/test.db'),
    path.join(__dirname, '/../prisma/database.db'),
  );
});

// restore user data after the tests finished
global.afterAll(async () => {
  await fs.copyFile(
    path.join(__dirname, '/../prisma/database.backup.db'),
    path.join(__dirname, '/../prisma/database.db'),
  );
  fs.unlink(path.join(__dirname, '/../prisma/database.backup.db'));
});
