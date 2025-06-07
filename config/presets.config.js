// config/presets.config.js
// Preset configurations for docs, blog, and theme

const presetsConfig = [
  [
    'classic',
    /** @type {import('@docusaurus/preset-classic').Options} */
    ({
      // Docs configuration (currently disabled)
      docs: false,
      
      // Theme configuration
      theme: {
        customCss: './src/css/custom.css',
      },
      
      // Blog configuration
      blog: {
        showReadingTime: true,
        path: 'blog',
        routeBasePath: 'blog',
        blogTitle: 'Blog',
        blogDescription: 'Equilibria Network Blog',
        postsPerPage: 10,
        authorsMapPath: 'authors.yml',
        
        // Blog sidebar configuration
        blogSidebarTitle: 'All posts',
        blogSidebarCount: 'ALL',
        
        // Feed configuration
        feedOptions: {
          type: 'all',
          copyright: `Copyright © ${new Date().getFullYear()} Equilibria Network.`,
        },
      },
      
      // Future preset configurations
      // pages: {
      //   path: 'src/pages',
      //   routeBasePath: '/',
      // },
    }),
  ],
];

module.exports = presetsConfig;
