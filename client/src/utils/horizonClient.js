const HORIZON_URL = import.meta.env.VITE_HORIZON_URL || 'https://horizon-testnet.stellar.org';

export const fetchAccount = async (walletAddress) => {
  const res = await fetch(`${HORIZON_URL}/accounts/${walletAddress}`);
  if (!res.ok) {
    throw new Error(res.status === 404 ? 'Wallet not found on Stellar testnet. Please fund it via Friendbot.' : 'Failed to fetch account');
  }
  return res.json();
};

export const fetchTransactions = async (walletAddress, limit = 50) => {
  const res = await fetch(`${HORIZON_URL}/accounts/${walletAddress}/transactions?limit=${limit}&order=desc`);
  if (!res.ok) {
    if (res.status === 404) throw new Error('Wallet not found on Stellar testnet. Please fund it via Friendbot.');
    throw new Error('Failed to fetch transactions');
  }
  const data = await res.json();
  return data._embedded.records;
};

export const fetchOperations = async (walletAddress, limit = 100) => {
  const res = await fetch(`${HORIZON_URL}/accounts/${walletAddress}/operations?limit=${limit}&order=desc`);
  if (!res.ok) {
    if (res.status === 404) throw new Error('Wallet not found on Stellar testnet. Please fund it via Friendbot.');
    throw new Error('Failed to fetch operations');
  }
  const data = await res.json();
  return data._embedded.records;
};

export const fetchAllWalletData = async (walletAddress) => {
  const [account, transactions, operations] = await Promise.all([
    fetchAccount(walletAddress),
    fetchTransactions(walletAddress),
    fetchOperations(walletAddress),
  ]);

  // Activity heatmap data
  const activityByDate = {};
  transactions.forEach(tx => {
    const date = tx.created_at.split('T')[0];
    activityByDate[date] = (activityByDate[date] || 0) + 1;
  });

  // Processed assets
  const assets = account.balances.map(b => ({
    asset: b.asset_type === 'native' ? 'XLM' : (b.asset_code || 'Unknown'),
    balance: parseFloat(b.balance),
    buyingLiabilities: parseFloat(b.buying_liabilities || 0),
    sellingLiabilities: parseFloat(b.selling_liabilities || 0),
  }));

  // Processed transactions
  const processedTx = transactions.map(tx => ({
    id: tx.id,
    hash: tx.hash,
    date: tx.created_at,
    fee: tx.fee_charged,
    operationCount: tx.operation_count,
    successful: tx.successful,
    memo: tx.memo,
  }));

  // Processed operations
  const processedOps = operations.map(op => ({
    id: op.id,
    type: op.type,
    date: op.created_at,
    from: op.from || op.funder || null,
    to: op.to || op.account || null,
    amount: op.amount || op.starting_balance || '0',
    asset: op.asset_type === 'native' ? 'XLM' : (op.asset_code || 'XLM'),
  }));

  return {
    walletAddress,
    accountId: account.account_id,
    sequence: account.sequence,
    subentryCount: account.subentry_count,
    assets,
    totalTransactions: transactions.length,
    transactions: processedTx,
    operations: processedOps,
    activityByDate,
    fetchedAt: new Date().toISOString(),
  };
};
