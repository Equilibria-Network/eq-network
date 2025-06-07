// docusaurus.config.js
// Main configuration file that imports all config modules

const path = require('path');
const siteConfig = require('./config/site.config.js');
const navbarConfig = require('./config/navbar.config.js');
const footerConfig = require('./config/footer.config.js');
const socialsConfig = require('./config/socials.config.js');
const uiConfig = require('./config/ui.config.js');
const webpackConfig = require('./config/webpack.config.js');
const pluginsConfig = require('./config/plugins.config.js');
const presetsConfig = require('./config/presets.config.js');

const config = {
  // Import basic site configuration
  ...siteConfig,
  
  // Import webpack configuration
  webpack: webpackConfig,
  
  // Import presets configuration
  presets: presetsConfig,
  
  // Compose theme configuration from individual modules
  themeConfig: {
    ...uiConfig,
    navbar: navbarConfig,
    footer: footerConfig,
    socials: socialsConfig,
  },
  
  // Import plugin-related configurations
  ...pluginsConfig,
  
  // Configure build tools to use config directory
  plugins: [
    // Configure PostCSS to use config directory
    [
      '@docusaurus/plugin-ideal-image',
      {
        quality: 70,
        max: 1030,
        min: 640,
        steps: 2,
        disableInDev: false,
      },
    ],
  ],
  
  // Custom webpack configuration for Tailwind/PostCSS
  customFields: {
    postcssConfigPath: path.resolve(__dirname, 'config/postcss.config.js'),
    tailwindConfigPath: path.resolve(__dirname, 'config/tailwind.config.js'),
  },
};

module.exports = config;
