export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['Syne', 'sans-serif'],
        body: ['DM Sans', 'sans-serif'],
      },
      colors: {
        'sm-purple': '#7C5CFC',
        'sm-teal': '#00D4B4',
        'sm-amber': '#F59E0B',
        'sm-coral': '#F97316',
        'sm-dark': '#05080F',
        'sm-card': '#0F1629',
      },
    },
  },
  plugins: [],
};
