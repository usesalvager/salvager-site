// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
// Fully static output (default). No SSR adapter — `astro build` emits static
// HTML/CSS into dist/, deployable to any static host.
export default defineConfig({
  site: 'https://salvager.sh',
  integrations: [sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
});
