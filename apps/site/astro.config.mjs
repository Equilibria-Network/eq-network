// astro.config.mjs
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  redirects: {
    '/lab/playground': '/playground',
    '/explainer': '/thesis',
    '/explainer/prototype': '/thesis',
    '/explainer/notebook-prototype': '/thesis',
  },
  integrations: [
    react(),
    sitemap({
      filter: (page) =>
        !page.endsWith('/404/') &&
        !page.includes('/explainer/') &&
        // promoted to /library/explanation 2026-08-08; the prototype route stays unlisted
        !page.includes('/library/prototype'),
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
