import { defineConfig } from 'vite';
import solidPlugin from 'vite-plugin-solid';

export default defineConfig({
  plugins: [solidPlugin()],
  envPrefix: ['VITE_'],
  server: {
    port: 5173,
  },
});
