// config/site.config.js
// Basic site metadata and deployment settings

const siteConfig = {
  // Basic site information
  title: 'Equilibria Network',
  tagline: 'Better decision-making through computational coordination and collective intelligence.',
  url: 'https://eq-network.org/',
  baseUrl: '/',
  favicon: 'img/favicon.ico',
  
  // GitHub Pages deployment configuration
  organizationName: 'Equilibria-Network',
  projectName: 'eq-network',
  deploymentBranch: 'gh-pages',
  trailingSlash: false,
  
  // Error handling
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  
  // Internationalization (i18n) - ready for future expansion
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },
};

module.exports = siteConfig;
