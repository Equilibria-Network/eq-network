// astro.config.mjs
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

export default defineConfig({
  integrations: [react()],
  site: 'https://eq-network.org',
  base: '/',
  output: 'static',
  build: {
    assets: 'assets',
  },
});
