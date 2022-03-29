const { fontFamily } = require('tailwindcss/defaultTheme');

module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'climate-blue': '#003A6C',
        'climate-white': '#FAFAFB',
        'climate-green': '#52662A',
        'climate-black-text': '#171725',
        'climate-gray': '#696974',
        'climate-gray-artist': '#92929D',
        'climate-gray-light': '#B5B5BE',

        'custom-white': '#F8FAFC',
        'custom-gray': '#37383D',
      },
      fontFamily: {
        sans: ['Roboto', 'sans-serif', ...fontFamily.sans],
        sanspro: ['SourceSansPro', 'sans-serif', ...fontFamily.sans],
        dinpro: ['DINNextLTPro', 'sans-serif', ...fontFamily.sans],
      },
    },
  },
  plugins: [],
};
