export const detectAnomalies = (walletData) => {
  if (!walletData?.transactions?.length) return [];
  const anomalies = [];
  const { transactions, operations } = walletData;

  // Check for sudden spike in transactions
  const byDate = {};
  transactions.forEach(tx => {
    const date = tx.date.split('T')[0];
    byDate[date] = (byDate[date] || 0) + 1;
  });

  const counts = Object.values(byDate);
  const avg = counts.reduce((a, b) => a + b, 0) / counts.length;
  Object.entries(byDate).forEach(([date, count]) => {
    if (count > avg * 3 && count > 5) {
      anomalies.push({
        date,
        description: `Unusually high activity: ${count} transactions in a single day`,
        severity: count > avg * 5 ? 'high' : 'medium'
      });
    }
  });

  // Large individual transactions
  if (operations) {
    const amounts = operations.map(op => parseFloat(op.amount || 0)).filter(a => a > 0);
    const avgAmount = amounts.reduce((a, b) => a + b, 0) / amounts.length;
    operations.forEach(op => {
      const amount = parseFloat(op.amount || 0);
      if (amount > avgAmount * 10 && amount > 1000) {
        anomalies.push({
          date: op.date?.split('T')[0] || 'Unknown',
          description: `Large transaction of ${amount.toFixed(0)} XLM detected`,
          severity: amount > avgAmount * 20 ? 'high' : 'medium'
        });
      }
    });
  }

  return anomalies.slice(0, 5);
};
