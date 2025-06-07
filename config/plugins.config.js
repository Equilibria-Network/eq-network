// config/plugins.config.js
// Plugin configurations for various features

const pluginsConfig = {
  // Math rendering support
  stylesheets: [
    {
      href: 'https://cdn.jsdelivr.net/npm/katex@0.13.24/dist/katex.min.css',
      type: 'text/css',
      integrity: 'sha384-odtC+0UGzzFL/6PNoE8rX/SPcQDXBJ+uRepguP4QkPCm2LBxH3FA3y+fKSiJ+AmM',
      crossorigin: 'anonymous',
    },
  ],
  
  // Future plugin configurations can be added here
  // Examples:
  // gtag: {
  //   trackingID: 'G-XXXXXXXXXX',
  //   anonymizeIP: true,
  // },
  // 
  // sitemap: {
  //   changefreq: 'weekly',
  //   priority: 0.5,
  // },
  //
  // pwa: {
  //   debug: false,
  //   offlineModeActivationStrategies: [
  //     'appInstalled',
  //     'standalone',
  //     'queryString',
  //   ],
  // },
};

module.exports = pluginsConfig;
