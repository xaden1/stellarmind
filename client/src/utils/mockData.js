export const MOCK_ANALYSIS = {
  healthScore: 74,
  healthBreakdown: { stability: 82, activity: 68, growth: 79, risk: 65 },
  personality: {
    archetype: 'The Explorer',
    description: 'You love trying new things on the network. Your wallet shows curiosity — multiple assets, frequent operations, and a diverse set of counterparties.',
    emoji: '🧭'
  },
  insights: [
    'You\'ve been more active in the last 30 days than the previous 60.',
    'Your wallet holds 3 different asset types — above average diversity.',
    'Your largest single transaction was 500 XLM sent on March 14.'
  ],
  anomalies: [
    { date: '2025-03-14', description: 'Unusually large outflow of 500 XLM in one operation', severity: 'medium' }
  ],
  moodScore: 72,
  moodLabel: 'Stable',
  networkComparison: {
    transactionFrequency: 'above average',
    assetDiversity: 'above average',
    summary: 'You transact 2.3x more frequently than the average Stellar testnet user.'
  },
  monthlyTrend: 'improving',
  topInsight: 'Your wallet is growing steadily with diverse assets and consistent activity — you\'re in the top 30% of active testnet users.'
};

export const MOCK_WALLET_DATA = {
  walletAddress: 'GDQP2KPQGKIHYJGXNUIYOMHARUARCA7DJT5FO2FFOOKY3B2WSQHG4W37',
  assets: [
    { asset: 'XLM', balance: 9450.23, buyingLiabilities: 0, sellingLiabilities: 0 },
    { asset: 'USDC', balance: 120.5, buyingLiabilities: 0, sellingLiabilities: 0 }
  ],
  totalTransactions: 23,
  transactions: Array.from({length: 23}, (_, i) => ({
    id: `tx${i}`, hash: `abc123${i}`,
    date: new Date(Date.now() - i * 3 * 24 * 60 * 60 * 1000).toISOString(),
    fee: '100', operationCount: 1, successful: true
  })),
  operations: Array.from({length: 30}, (_, i) => ({
    id: `op${i}`, type: i % 3 === 0 ? 'create_account' : 'payment',
    date: new Date(Date.now() - i * 2.5 * 24 * 60 * 60 * 1000).toISOString(),
    from: i % 2 === 0 ? 'GDQP2KPQGKIHYJGXNUIYOMHARUARCA7DJT5FO2FFOOKY3B2WSQHG4W37' : 'GABC123XYZ',
    to: i % 2 === 0 ? 'GABC123XYZ' : 'GDQP2KPQGKIHYJGXNUIYOMHARUARCA7DJT5FO2FFOOKY3B2WSQHG4W37',
    amount: String(Math.floor(Math.random() * 500) + 10),
    asset: 'XLM'
  })),
  activityByDate: Object.fromEntries(
    Array.from({length: 60}, (_, i) => {
      const d = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
      const key = d.toISOString().split('T')[0];
      const val = Math.random() > 0.6 ? Math.floor(Math.random() * 8) + 1 : 0;
      return [key, val];
    }).filter(([,v]) => v > 0)
  )
};
