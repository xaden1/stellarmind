export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    screens: {
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1400px'
    },
    extend: {
      fontFamily: {
        display: ['Syne', 'sans-serif'],
        body: ['DM Sans', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        'bg-void': 'var(--bg-void)',
        'bg-base': 'var(--bg-base)',
        'bg-surface': 'var(--bg-surface)',
        'bg-elevated': 'var(--bg-elevated)',
        'bg-overlay': 'var(--bg-overlay)',
        'indigo': 'var(--indigo)',
        'cyan': 'var(--cyan)',
        'green': 'var(--green)',
        'amber': 'var(--amber)',
        'red': 'var(--red)',
        'violet': 'var(--violet)',
        't1': 'var(--t1)',
        't2': 'var(--t2)',
        't3': 'var(--t3)',
        't4': 'var(--t4)',
        'b1': 'var(--b1)',
        'b2': 'var(--b2)',
        'b3': 'var(--b3)',
      },
    },
  },
  plugins: [],
};
