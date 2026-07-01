// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
// Fully static output (default). No SSR adapter — `astro build` emits static
// HTML/CSS into dist/, deployable to any static host.
export default defineConfig({
  site: 'https://salvager.sh',
  // Keep the JSON feeds (STIX bundles) out of the sitemap — pages only.
  integrations: [sitemap({ filter: (page) => !page.includes('.json') })],
  vite: {
    plugins: [tailwindcss()],
  },
});
