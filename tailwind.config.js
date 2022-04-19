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
        'climate-black-title': '#44444F',
        'climate-gray': '#696974',
        'climate-gray-artist': '#92929D',
        'climate-gray-light': '#B5B5BE',
        'climate-border': '#E2E2EA',
        'climate-informative-green': '#90D963',
        'climate-green-light': '#3DD598',
        'custom-white': '#F8FAFC',
        'custom-gray': '#37383D',
        'climate-action-light': '#F1F1F5',
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
