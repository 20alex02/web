import { PrismaClient } from '@prisma/client';
import { execSync } from 'child_process';
import { randomUUID } from 'crypto';
import { rm } from 'fs/promises';
import { join } from 'path';
import { afterEach, beforeEach } from 'vitest';

const schemaId = `test-${randomUUID()}`;
const url = `file:./${schemaId}.db`;

const prisma = new PrismaClient({
  datasources: { db: { url } },
});

const prismaBinary = join(
  __dirname,
  '..',
  '..',
  '..',
  'node_modules',
  '.bin',
  'prisma',
);

const testPath = join(__dirname, '..', '..', '..', 'prisma', `${schemaId}.db`);

beforeEach(() => {
  execSync(`${prismaBinary} db push`, {
    env: {
      ...process.env,
      DATABASE_URL: url || '', // failsafe
    },
  });
});

afterEach(async () => {
  await prisma.$disconnect();
  await rm(testPath);
});

export default prisma;
