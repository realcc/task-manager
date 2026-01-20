import { defineConfig } from 'vitest/config';
import swc from 'unplugin-swc';

export default defineConfig({
  test: {
    globals: true,
    root: './',
    include: ['test/**/*.e2e-spec.ts'],
    testTimeout: 30000,
    hookTimeout: 30000,
  },
  plugins: [swc.vite() as any],
});
