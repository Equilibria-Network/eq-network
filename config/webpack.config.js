// config/webpack.config.js
// Webpack optimization and build configuration

const webpackConfig = {
  jsLoader: (isServer) => ({
    loader: require.resolve('esbuild-loader'),
    options: {
      loader: 'jsx',
      target: isServer ? 'node12' : 'es2017',
    },
  }),
};

module.exports = webpackConfig;
