import { defineConfig } from 'vitest/config'
import { resolve } from 'node:path'

// Minimal config: only the '@' path alias so analytics unit tests can import
// @/lib/* the same way app code does. Pure functions -> default node env; no
// jsdom, no React Testing Library (see docs/tracking T-01 scope).
export default defineConfig({
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  test: {
    include: ['src/**/*.{test,spec}.ts'],
  },
})
