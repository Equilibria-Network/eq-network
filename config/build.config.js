// config/build.config.js
// Build and development configuration

const buildConfig = {
  // Development server configuration
  devServer: {
    port: 3000,
    host: 'localhost',
    open: true,
    hot: true,
  },
  
  // Build optimization
  optimization: {
    minimize: true,
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true,
        },
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          priority: -10,
          chunks: 'all',
        },
      },
    },
  },
  
  // Bundle analyzer (for future use)
  bundleAnalyzer: {
    enabled: false, // Set to true when you want to analyze bundle
    openAnalyzer: false,
  },
  
  // Future build configurations
  // minify: true,
  // extractCSS: true,
  // generateSitemap: true,
};

module.exports = buildConfig;
