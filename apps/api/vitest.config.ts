import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['src/**/*.test.ts', 'tests/**/*.test.ts'],
    testTimeout: 10000,
    fileParallelism: false,
    pool: 'forks',
    env: {
      NODE_ENV: 'test',
      DATABASE_URL: 'postgresql://permata_user:permata_pass@localhost:5432/permata_test?schema=public',
      ACCESS_TOKEN_SECRET: 'super-secret-access-token-key-for-testing-at-least-32-characters',
      REFRESH_TOKEN_SECRET: 'super-secret-refresh-token-key-for-testing-at-least-32-characters',
    },
  },
});
