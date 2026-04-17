import { defineConfig } from 'vitest/config';
import solidPlugin from 'vite-plugin-solid';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** Stub the solid-refresh runtime so HMR virtual imports don't fail in tests. */
const solidRefreshStub = {
  name: 'solid-refresh-stub',
  enforce: 'pre',
  resolveId(id) {
    if (id === 'solid-refresh' || id === '@solid-refresh' || id === '/@solid-refresh')
      return '\0solid-refresh-stub';
  },
  load(id) {
    if (id === '\0solid-refresh-stub') {
      return 'export function hot() {}\n'
           + 'export function $$registry() {}\n'
           + 'export function $$component(_reg, _id, c) { return c; }\n'
           + 'export function $$context() {}\n'
           + 'export function $$decline() {}\n'
           + 'export function $$refresh() {}\n'
           + 'export default {};';
    }
  },
};

export default defineConfig({
  plugins: [solidRefreshStub, solidPlugin({ dev: false })],
  resolve: {
    alias: {
      'solid-js/web': path.resolve(__dirname, 'node_modules/solid-js/web/dist/dev.js'),
      'solid-js': path.resolve(__dirname, 'node_modules/solid-js/dist/dev.js'),
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    transformMode: { web: [/\.[jt]sx?$/] },
    setupFiles: ['./src/test/setup.js'],
    include: ['src/**/*.test.{js,jsx}'],
  },
});
