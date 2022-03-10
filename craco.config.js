const path = require('path');

module.exports = {
  webpack: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
    configure: (conf) => {
      conf.resolve.fallback = {
        crypto: require.resolve('crypto-browserify'),
        stream: require.resolve('stream-browserify'),
        buffer: require.resolve('buffer'),
      };
      return conf;
    },
  },
  style: {
    postcssOptions: {
      plugins: [require('tailwindcss/nesting'), require('tailwindcss'), require('autoprefixer')],
    },
  },
};
