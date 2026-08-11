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
        // prototype-programme routes are noindex; keep them out of the sitemap too
        !page.includes('/prototype'),
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
