/* IMPORTANT: Do NOT modify this file */
import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  setupFilesAfterEnv: [
    '<rootDir>/tests/index.ts',
  ],
};

export default config;
