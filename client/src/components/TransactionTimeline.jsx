import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatDate, formatXLM } from '../utils/formatters';

function getTxTypeConfig(type) {
  const configs = {
    payment: { label: 'Payment', color: '#7C5CFC' },
    create_account: { label: 'Account Created', color: '#00D4B4' },
    change_trust: { label: 'Trust Change', color: '#F59E0B' },
    manage_sell_offer: { label: 'Sell Offer', color: '#F97316' },
    manage_buy_offer: { label: 'Buy Offer', color: '#3B82F6' },
    default: { label: 'Operation', color: '#94A3B8' }
  };
  return configs[type] || configs.default;
}

export default function TransactionTimeline({ transactions = [], operations = [] }) {
  const [expanded, setExpanded] = useState(null);

  const items = transactions.slice(0, 20).map(tx => {
    const relatedOp = operations.find(op => op.date === tx.date);
    const typeConfig = getTxTypeConfig(relatedOp?.type || 'payment');
    const isIncoming = relatedOp?.to && !relatedOp?.from;
    const dirColor = isIncoming ? '#00D4B4' : relatedOp?.type === 'payment' ? '#F97316' : typeConfig.color;

    return {
      ...tx,
      op: relatedOp,
      typeConfig,
      dirColor,
      amount: relatedOp?.amount,
      asset: relatedOp?.asset || 'XLM'
    };
  });

  return (
    <div className="glass-card p-5">
      <h3 className="text-sm font-medium text-slate-400 mb-4">Transaction History</h3>

      <div className="overflow-y-auto space-y-2" style={{ maxHeight: 380 }}>
        {items.length === 0 ? (
          <p className="text-xs text-slate-500 text-center py-8">No transactions found</p>
        ) : (
          items.map((tx, i) => (
            <div key={tx.id || i}>
              <motion.div
                layout
                className="flex items-center gap-3 p-3 rounded-xl cursor-pointer hover:bg-opacity-80 transition-colors"
                style={{ background: '#0D1425' }}
                onClick={() => setExpanded(expanded === i ? null : i)}
              >
                {/* Type icon */}
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ background: `${tx.dirColor}20` }}
                >
                  <div className="w-2 h-2 rounded-full" style={{ background: tx.dirColor }} />
                </div>

                {/* Middle */}
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-white truncate">{tx.typeConfig.label}</p>
                  {tx.amount && (
                    <p className="text-xs text-slate-400">{formatXLM(tx.amount)} {tx.asset !== 'XLM' ? tx.asset : ''}</p>
                  )}
                </div>

                {/* Right */}
                <div className="text-right flex-shrink-0">
                  <p className="text-xs text-slate-400">{formatDate(tx.date)}</p>
                  <span
                    className="text-xs px-1.5 py-0.5 rounded"
                    style={{ color: tx.successful ? '#00D4B4' : '#EF4444', background: tx.successful ? 'rgba(0,212,180,0.1)' : 'rgba(239,68,68,0.1)' }}
                  >
                    {tx.successful ? '✓' : '✗'}
                  </span>
                </div>
              </motion.div>

              {/* Expanded */}
              <AnimatePresence>
                {expanded === i && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mx-3 mb-1 px-3 py-2 rounded-b-xl"
                    style={{ background: '#0a0f1e' }}
                  >
                    <p className="text-xs text-slate-500 font-mono break-all">{tx.hash}</p>
                    <a
                      href={`https://stellar.expert/explorer/testnet/tx/${tx.hash}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs mt-1 inline-block hover:underline"
                      style={{ color: '#7C5CFC' }}
                    >
                      View on Stellar Expert →
                    </a>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
