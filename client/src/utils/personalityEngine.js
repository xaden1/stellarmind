const ARCHETYPES = [
  {
    id: 'hodler',
    archetype: 'The Hodler',
    emoji: '💎',
    description: 'You accumulate and hold. Your wallet shows long-term conviction over short-term gains.',
    test: (data) => data.totalTransactions < 10 && data.balances?.some(b => parseFloat(b.balance) > 100)
  },
  {
    id: 'trader',
    archetype: 'The Trader',
    emoji: '📈',
    description: 'High-frequency mover. Your wallet buzzes with activity and market engagement.',
    test: (data) => data.totalTransactions > 30
  },
  {
    id: 'philanthropist',
    archetype: 'The Philanthropist',
    emoji: '🤝',
    description: 'You give more than you receive. Your transactions tell a story of generosity.',
    test: (data) => {
      const sends = data.operations?.filter(op => op.type === 'payment' && op.from === data.walletAddress).length || 0;
      const receives = data.operations?.filter(op => op.type === 'payment' && op.to === data.walletAddress).length || 0;
      return sends > receives * 1.5;
    }
  },
  {
    id: 'explorer',
    archetype: 'The Explorer',
    emoji: '🧭',
    description: 'Diverse assets, experimental moves. You embrace the full Stellar ecosystem.',
    test: (data) => data.balances?.length > 2
  },
  {
    id: 'whale',
    archetype: 'The Whale-in-Training',
    emoji: '🐋',
    description: 'Large transactions define your journey. You think in thousands, not hundreds.',
    test: (data) => data.operations?.some(op => parseFloat(op.amount || 0) > 5000)
  }
];

export const detectPersonality = (walletData) => {
  if (!walletData) {
    return { archetype: 'The Explorer', emoji: '🧭', description: 'Your financial journey is just beginning on Stellar.' };
  }
  for (const archetype of ARCHETYPES) {
    if (archetype.test(walletData)) {
      return { archetype: archetype.archetype, emoji: archetype.emoji, description: archetype.description };
    }
  }
  return { archetype: 'The Builder', emoji: '🔨', description: 'Steady, purposeful, methodical. You build wealth brick by brick.' };
};
