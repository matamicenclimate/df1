// const { writeFileSync } = require('fs');
// const { format } = require('prettier');
const path = require('path');
const cp = require('child_process');

module.exports = {
  webpack: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
    configure: (conf) => {
      console.log('Compiling smart contract IR...');
      cp.execSync(`python auction/contracts.py`, {
        cwd: 'contracts',
      });
      console.log('Done! Output to src/lib/contracts');
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
      // writeFileSync('config.js', format(`module.exports = ${JSON.stringify(conf)}`));
      return conf;
    },
  },
  style: {
    postcssOptions: {
      plugins: [require('tailwindcss/nesting'), require('tailwindcss'), require('autoprefixer')],
    },
  },
};
