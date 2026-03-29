export const calculateHealthScore = (walletData) => {
  if (!walletData || !walletData.transactions) return { total: 0, stability: 0, activity: 0, growth: 0, risk: 0 };
  const { transactions, operations, walletAddress } = walletData;
  const now = new Date();

  // Stability: unique active days
  const activeDays = new Set(transactions.map(tx => tx.date.split('T')[0])).size;
  const stability = Math.min(100, activeDays * 5);

  // Activity: recent tx in last 30 days
  const recentTx = transactions.filter(tx => (now - new Date(tx.date)) / 864e5 <= 30).length;
  const activity = Math.min(100, 20 + recentTx * 15);

  // Growth: inflow vs outflow ratio
  const inflows = operations.filter(op => op.type === 'payment' && op.to === walletAddress).length;
  const outflows = operations.filter(op => op.type === 'payment' && op.from === walletAddress).length;
  const growth = outflows === 0 ? 70 : Math.min(100, Math.round((inflows / (inflows + outflows)) * 100));

  // Risk: fewer large ops = lower risk
  const largeOps = operations.filter(op => parseFloat(op.amount || 0) > 1000).length;
  const risk = Math.max(0, 90 - largeOps * 10);

  const total = Math.min(100, Math.max(0, Math.round(stability * 0.25 + activity * 0.30 + growth * 0.25 + risk * 0.20)));
  return { total, stability, activity, growth, risk };
};
