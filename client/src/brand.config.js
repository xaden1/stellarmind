// StellarMind Brand Configuration
// Single source of truth for all brand tokens.
// Import this wherever you need brand values — components, meta tags, etc.

export const brand = {
  name: 'StellarMind',
  tagline: 'AI-Powered Financial Intelligence',
  description:
    'Connect your Stellar wallet. Get AI-powered insights about your financial behavior, health score, and wallet personality — entirely in your browser.',

  // Asset paths (relative to /public)
  logoMark: '/brand/logo-mark.svg',
  logoFull: '/brand/logo-full.svg',
  favicon: '/brand/favicon.svg',

  // Colors — single source of truth for all gradient and glass values
  colors: {
    bgBase: '#F5F7FA',
    bgSurface: '#FFFFFF',
    primary: {
      from: '#7C5CFC',
      to: '#4F46E5',
      glow: 'rgba(124,92,252,0.25)',
    },
    secondary: {
      from: '#06B6D4',
      to: '#10B981',
      glow: 'rgba(6,182,212,0.2)',
    },
    callout: {
      from: '#8B5CF6',
      mid: '#6366F1',
      to: '#06B6D4',
    },
    aurora: {
      violet: '#8B5CF6',
      teal: '#06B6D4',
      magenta: '#EC4899',
    },
  },

  // Glass design tokens
  glass: {
    bg: 'rgba(255,255,255,0.38)',
    bgHover: 'rgba(255,255,255,0.55)',
    border: 'rgba(99,102,241,0.12)',
    borderHover: 'rgba(99,102,241,0.22)',
    blur: '22px',
    blurHeavy: '40px',
    shadow: '0 8px 32px rgba(99,102,241,0.04), inset 0 1px 0 rgba(255,255,255,0.6)',
    radius: '20px',
  },

  // Social / SEO
  social: {
    twitterHandle: '@stellarmind',
    ogImage: '/brand/og-image.png',
  },
};

export default brand;
