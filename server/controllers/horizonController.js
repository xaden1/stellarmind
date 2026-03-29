const axios = require('axios');
const HORIZON_URL = process.env.HORIZON_URL || 'https://horizon-testnet.stellar.org';

exports.getWalletData = async (req, res) => {
  const { walletAddress } = req.params;
  try {
    const [accountRes, txRes, opsRes] = await Promise.all([
      axios.get(`${HORIZON_URL}/accounts/${walletAddress}`),
      axios.get(`${HORIZON_URL}/accounts/${walletAddress}/transactions?limit=50&order=desc`),
      axios.get(`${HORIZON_URL}/accounts/${walletAddress}/operations?limit=100&order=desc`)
    ]);

    const account = accountRes.data;
    const transactions = txRes.data._embedded.records;
    const operations = opsRes.data._embedded.records;

    const processedData = {
      walletAddress,
      balances: account.balances,
      sequence: account.sequence,
      totalTransactions: transactions.length,
      transactions: transactions.map(tx => ({
        id: tx.id,
        hash: tx.hash,
        date: tx.created_at,
        fee: tx.fee_charged,
        operationCount: tx.operation_count,
        successful: tx.successful
      })),
      operations: operations.map(op => ({
        id: op.id,
        type: op.type,
        date: op.created_at,
        from: op.from || op.funder,
        to: op.to || op.account,
        amount: op.amount || op.starting_balance,
        asset: op.asset_type === 'native' ? 'XLM' : (op.asset_code || 'Unknown')
      })),
      activityByDate: groupByDate(transactions),
      assetSummary: summarizeAssets(account.balances, operations)
    };

    res.json({ success: true, data: processedData });
  } catch (err) {
    if (err.response?.status === 404) {
      res.status(404).json({ success: false, error: 'Wallet not found on Stellar testnet. Please ensure the account is funded.' });
    } else {
      res.status(500).json({ success: false, error: err.message });
    }
  }
};

function groupByDate(transactions) {
  const grouped = {};
  transactions.forEach(tx => {
    const date = tx.created_at.split('T')[0];
    grouped[date] = (grouped[date] || 0) + 1;
  });
  return grouped;
}

function summarizeAssets(balances, operations) {
  return balances.map(b => ({
    asset: b.asset_type === 'native' ? 'XLM' : b.asset_code,
    balance: parseFloat(b.balance),
    buyingLiabilities: parseFloat(b.buying_liabilities || 0),
    sellingLiabilities: parseFloat(b.selling_liabilities || 0)
  }));
}
