import { formatDistanceToNow, format } from 'date-fns';

export const truncateAddress = (addr, chars = 5) => {
  if (!addr) return '';
  return `${addr.slice(0, chars)}...${addr.slice(-chars)}`;
};

export const formatXLM = (amount) => {
  const n = parseFloat(amount);
  if (isNaN(n)) return '0 XLM';
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(2)}M XLM`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(2)}K XLM`;
  return `${n.toFixed(2)} XLM`;
};

export const formatRelative = (dateStr) => {
  try { return formatDistanceToNow(new Date(dateStr), { addSuffix: true }); }
  catch { return dateStr || ''; }
};

export const formatDate = (dateStr) => {
  try { return format(new Date(dateStr), 'MMM d, yyyy'); }
  catch { return dateStr || ''; }
};

export const getScoreColor = (score) => {
  if (score >= 70) return '#00D4B4';
  if (score >= 40) return '#F59E0B';
  return '#EF4444';
};

export const getScoreLabel = (score) => {
  if (score >= 80) return 'Excellent';
  if (score >= 60) return 'Good';
  if (score >= 40) return 'Fair';
  if (score >= 20) return 'Needs Work';
  return 'At Risk';
};

export const getMoodColor = (label) => {
  const map = { Thriving: '#00D4B4', Stable: '#10B981', Cautious: '#F59E0B', Volatile: '#F97316', Dormant: '#475569' };
  return map[label] || '#7C5CFC';
};

export const getSeverityColor = (severity) => {
  const map = { high: '#EF4444', medium: '#F59E0B', low: '#3B82F6' };
  return map[severity] || '#94A3B8';
};

export const humanizeOperationType = (type) => {
  const map = {
    payment: 'Payment',
    create_account: 'Account Created',
    change_trust: 'Trust Line',
    manage_offer: 'Trade Offer',
    path_payment_strict_send: 'Path Payment',
    path_payment_strict_receive: 'Path Payment',
    manage_sell_offer: 'Sell Offer',
    manage_buy_offer: 'Buy Offer',
    set_options: 'Settings Changed',
    account_merge: 'Account Merged',
    manage_data: 'Data Entry',
    claim_claimable_balance: 'Claim Balance',
    create_claimable_balance: 'Create Claimable',
    invoke_host_function: 'Smart Contract',
    liquidity_pool_deposit: 'LP Deposit',
    liquidity_pool_withdraw: 'LP Withdraw',
  };
  return map[type] || (type ? type.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) : 'Operation');
};

export const copyToClipboard = async (text) => {
  try { await navigator.clipboard.writeText(text); return true; }
  catch { return false; }
};
