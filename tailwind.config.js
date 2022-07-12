const { fontFamily } = require('tailwindcss/defaultTheme');

module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'climate-blue': '#003A6C',
        'climate-light-green': '#008868',
        'climate-light-blue': '#1C64F2',
        'climate-light-gray': '#777E8B',
        'climate-white-gray': '#FAFAFA',
        'climate-black': '#021120',

        'climate-white': '#FAFAFB',
        'climate-green': '#52662A',
        'climate-black-text': '#171725',
        'climate-black-title': '#44444F',
        'climate-gray': '#696974',
        'climate-gray-artist': '#92929D',
        'climate-gray-light': '#B5B5BE',
        'climate-border': '#E2E2EA',
        'climate-informative-green': '#90D963',
        'climate-informative-yellow': '#DCBA86',
        'climate-green-light': '#3DD598',
        'custom-white': '#F8FAFC',
        'custom-gray': '#37383D',
        'climate-action-light': '#F1F1F5',
      },
      fontFamily: {
        sans: ['Roboto', 'sans-serif', ...fontFamily.sans],
        sanspro: ['SourceSansPro', 'sans-serif', ...fontFamily.sans],
        dinpro: ['DINNextLTPro', 'sans-serif', ...fontFamily.sans],
        inter: ['Inter', 'sans-serif', ...fontFamily.sans],
      },
    },
  },
  plugins: [],
};
