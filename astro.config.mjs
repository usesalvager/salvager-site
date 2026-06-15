// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
// Fully static output (default). No SSR adapter — `astro build` emits static
// HTML/CSS into dist/, deployable to any static host.
export default defineConfig({
  site: 'https://salvager.sh',
  vite: {
    plugins: [tailwindcss()],
  },
});
