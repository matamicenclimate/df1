// const { writeFileSync } = require('fs');
// const { format } = require('prettier');
const path = require('path');
const fs = require('fs');
const prettier = require('prettier');
const { CracoAliasPlugin } = require('react-app-alias');

/**
 * @param {*} object
 * @returns {string}
 */
function dumpJs(object) {
  return JSON.stringify(object, (_key, value) => {
    if (value instanceof RegExp) {
      return value.toString();
    }
    return value;
  });
}

/**
 * @param {string} path
 * @param {import('./webpack.conf')} conf
 */
function dumpObject(path, conf) {
  fs.writeFileSync(
    path,
    prettier
      .format(`// Fake webpack configuration\nmodule.exports = ${dumpJs(conf)}`)
      .replace(/"(\/.*?\/i?g?)"/g, (_, g) => {
        return g.replace(/\\\\/g, '\\');
      })
  );
}

module.exports = {
  plugins: [
    {
      plugin: CracoAliasPlugin,
      options: {},
    },
  ],
  webpack: {
    alias: {
      '@common': path.resolve(__dirname, 'climate-nft-common'),
      '@': path.resolve(__dirname, 'src'),
    },
    /** @param {import('./webpack.conf')} conf */
    configure: (conf) => {
      conf.ignoreWarnings = [/node_modules/i];
      conf.resolve.fallback = {
        crypto: require.resolve('crypto-browserify'),
        stream: require.resolve('stream-browserify'),
        buffer: require.resolve('buffer'),
      };
      conf.module.rules[1].oneOf.unshift({
        test: /\.teal$/i,
        use: [
          {
            loader: require.resolve('raw-loader'),
          },
        ],
      });
      // This line dumps example configuration.
      // You may use it to crawl the configuration tree, in order to have a brief insight of it's structure.
      dumpObject('.webpack.conf.js', conf);
      return conf;
    },
  },
  style: {
    postcssOptions: {
      plugins: [require('tailwindcss/nesting'), require('tailwindcss'), require('autoprefixer')],
    },
  },
};
