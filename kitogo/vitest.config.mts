import { defineConfig } from 'vitest/config';

// Unit-test config. We only test pure logic in src/lib, so the default
// node environment is fine — no jsdom / React rendering needed here.
// `resolve.tsconfigPaths` makes the `@/*` alias from tsconfig.json work.
export default defineConfig({
  resolve: {
    tsconfigPaths: true,
  },
  test: {
    environment: 'node',
    globals: true,
    include: ['src/**/*.test.ts'],
  },
});
