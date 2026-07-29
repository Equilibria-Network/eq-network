// astro.config.mjs
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  integrations: [
    react(),
    sitemap({
      filter: (page) =>
        !page.endsWith('/404/') &&
        !page.includes('/explainer/prototype/') &&
        !page.includes('/lab/playground/'),
    }),
  ],
  site: 'https://eq-network.org',
  base: '/',
  output: 'static',
  build: {
    assets: 'assets',
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
