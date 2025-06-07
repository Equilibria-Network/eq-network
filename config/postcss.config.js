// config/postcss.config.js
// PostCSS configuration for CSS processing

const path = require('path');

const postcssConfig = {
  plugins: {
    // Tailwind CSS processing - point to our config location
    tailwindcss: {
      config: path.resolve(__dirname, './tailwind.config.js'),
    },
    
    // Autoprefixer for browser compatibility
    autoprefixer: {
      // Autoprefixer options
      grid: true,
      flexbox: 'no-2009',
    },
    
    // Additional PostCSS plugins can be added here
    // 'postcss-preset-env': {
    //   stage: 1,
    //   features: {
    //     'custom-properties': false,
    //   },
    // },
    
    // CSS optimization for production
    ...(process.env.NODE_ENV === 'production' && {
      cssnano: {
        preset: ['default', {
          discardComments: {
            removeAll: true,
          },
        }],
      },
    }),
  },
};

module.exports = postcssConfig;
