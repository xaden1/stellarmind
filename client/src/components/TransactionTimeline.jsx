import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowDownLeft, ArrowUpRight, Plus, Activity, ExternalLink, Copy, Check } from 'lucide-react';

const FILTERS = ['All', 'Incoming', 'Outgoing', 'Other'];

export default function TransactionTimeline({ transactions = [], operations = [], walletAddress = '' }) {
  const [filter, setFilter] = useState('All');
  const [expandedId, setExpandedId] = useState(null);
  const [copiedHash, setCopiedHash] = useState(null);

  const mappedTx = useMemo(() => {
    return transactions.map(tx => {
      // Find ops belonging to this tx
      const txOps = operations.filter(op => op.id === tx.id || op.date === tx.date); // Mock mapping via date if ID isn't linked
      const mainOp = txOps[0] || {};
      
      const isIncoming = mainOp.to === walletAddress || (mainOp.to && !mainOp.from);
      const isOutgoing = mainOp.from === walletAddress || (!mainOp.to && mainOp.from);
      
      let typeCategory = 'other';
      if (mainOp.type === 'payment' && isIncoming) typeCategory = 'incoming';
      if (mainOp.type === 'payment' && isOutgoing) typeCategory = 'outgoing';
      if (mainOp.type === 'create_account') typeCategory = 'create_account';

      return {
        ...tx,
        txOps,
        mainOp,
        typeCategory,
        isIncoming,
        isOutgoing
      };
    }).sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [transactions, operations, walletAddress]);

  const filteredTx = useMemo(() => {
    if (filter === 'All') return mappedTx.slice(0, 30);
    return mappedTx.filter(tx => {
      if (filter === 'Incoming') return tx.typeCategory === 'incoming';
      if (filter === 'Outgoing') return tx.typeCategory === 'outgoing';
      if (filter === 'Other') return !['incoming', 'outgoing'].includes(tx.typeCategory);
      return true;
    }).slice(0, 30);
  }, [mappedTx, filter]);

  const handleCopy = (e, hash) => {
    e.stopPropagation();
    navigator.clipboard.writeText(hash);
    setCopiedHash(hash);
    setTimeout(() => setCopiedHash(null), 2000);
  };

  const truncate = (str, len = 6) => {
    if (!str) return '';
    return `${str.slice(0, len)}...${str.slice(-len)}`;
  };

  const getRelativeTime = (isoString) => {
    const d = new Date(isoString);
    const now = new Date();
    const diffDays = Math.floor((now - d) / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    return `${diffDays}d ago`;
  };

  const containerVars = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.04 } }
  };
  const itemVars = {
    hidden: { opacity: 0, x: -20 },
    show: { opacity: 1, x: 0, transition: { ease: 'easeOut', duration: 0.3 } }
  };

  return (
    <div className="card p-6 flex flex-col h-full min-h-[500px]">

      {/* Header */}
      <div className="flex justify-between items-center mb-4 shrink-0">
        <h2 className="font-display font-bold text-[16px] text-[var(--t1)] m-0">Recent Transactions</h2>
        {walletAddress && (
          <a
            href={`https://stellar.expert/explorer/testnet/account/${walletAddress}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[13px] text-[var(--indigo)] hover:text-[var(--indigo-bright)] font-medium transition-colors"
          >
            View all →
          </a>
        )}
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-4 overflow-x-auto shrink-0 [&::-webkit-scrollbar]:hidden">
        {FILTERS.map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-[14px] py-[6px] rounded-[20px] text-[13px] font-medium transition-all ${
              filter === f 
                ? 'bg-[var(--indigo)] text-white border-[var(--indigo)]' 
                : 'bg-[var(--bg-elevated)] border border-[var(--b2)] text-[var(--t2)] hover:text-[var(--t1)] hover:border-[var(--indigo)]'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto pr-2 relative [&::-webkit-scrollbar]:w-[4px] [&::-webkit-scrollbar-thumb]:bg-[var(--indigo)] [&::-webkit-scrollbar-track]:bg-transparent">
         {filteredTx.length === 0 ? (
           <div className="absolute inset-0 flex flex-col items-center justify-center text-[var(--t3)]">
              <Activity className="w-[48px] h-[48px] mb-3 opacity-50" />
              <p className="font-body text-[14px]">No transactions found</p>
           </div>
         ) : (
           <motion.div variants={containerVars} initial="hidden" animate="show" className="flex flex-col">
             <AnimatePresence>
               {filteredTx.map((tx) => {
                 const isExpanded = expandedId === tx.id;
                 const typeCat = tx.typeCategory;
                 
                 let icon = <Activity className="w-[16px] h-[16px] text-[var(--t3)]" />;
                 let iconBg = 'bg-[var(--bg-overlay)]';
                 let amtColor = 'text-[var(--t2)]';
                 let opLabel = (tx.mainOp.type || 'operation').replace('_', ' ');
                 
                 if (typeCat === 'incoming') {
                   icon = <ArrowDownLeft className="w-[16px] h-[16px] text-[var(--cyan)]" />;
                   iconBg = 'bg-[var(--cyan-dim)]';
                   amtColor = 'text-[var(--green)]';
                 } else if (typeCat === 'outgoing') {
                   icon = <ArrowUpRight className="w-[16px] h-[16px] text-[var(--red)]" />;
                   iconBg = 'bg-[var(--red-dim)]';
                   amtColor = 'text-[var(--red)]';
                 } else if (typeCat === 'create_account') {
                   icon = <Plus className="w-[16px] h-[16px] text-[var(--indigo)]" />;
                   iconBg = 'bg-[var(--indigo-dim)]';
                 }

                 // Title casing
                 opLabel = opLabel.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

                 return (
                   <motion.div 
                     layout
                     variants={itemVars}
                     initial="hidden"
                     animate="show"
                     exit={{ opacity: 0, scale: 0.95 }}
                     key={tx.id}
                     className="timeline-item mb-1 group"
                   >
                     <div 
                       onClick={() => setExpandedId(isExpanded ? null : tx.id)}
                       className={`flex items-center gap-3 py-[10px] px-2 rounded-[8px] cursor-pointer transition-colors ${isExpanded ? 'bg-[var(--bg-elevated)]' : 'hover:bg-[var(--bg-elevated)]'}`}
                     >
                        {/* Icon */}
                        <div className={`w-[36px] h-[36px] rounded-full flex items-center justify-center shrink-0 ${iconBg} z-10 relative`}>
                           {icon}
                        </div>

                        {/* Center */}
                        <div className="flex-1 flex flex-col justify-center min-w-0">
                           <div className="flex justify-between items-center mb-0.5">
                              <span className="font-body text-[14px] font-medium text-[var(--t1)] truncate pr-2">
                                {opLabel}
                              </span>
                              <span className={`font-mono text-[14px] font-semibold shrink-0 ${amtColor}`}>
                                {tx.mainOp.amount ? `${tx.typeCategory === 'outgoing' ? '-' : tx.typeCategory === 'incoming' ? '+' : ''}${tx.mainOp.amount} ${tx.mainOp.asset||'XLM'}` : ''}
                              </span>
                           </div>
                           <div className="flex justify-between items-center">
                              <div className="font-mono text-[11px] text-[var(--t3)] flex items-center gap-1.5 truncate pr-2">
                                {tx.typeCategory === 'outgoing' ? `To: ${truncate(tx.mainOp.to)}` : tx.typeCategory === 'incoming' ? `From: ${truncate(tx.mainOp.from)}` : truncate(tx.hash)}
                                <span className="text-[14px] leading-none">·</span>
                                <span className="font-body text-[11px]">{getRelativeTime(tx.date)}</span>
                              </div>
                              <ExternalLink 
                                className="w-[14px] h-[14px] text-[var(--t3)] opacity-0 group-hover:opacity-100 transition-opacity hover:text-[var(--indigo)]"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  window.open(`https://stellar.expert/explorer/testnet/tx/${tx.hash}`, '_blank');
                                }}
                              />
                           </div>
                        </div>
                     </div>

                     {/* Expanded details */}
                     <AnimatePresence>
                       {isExpanded && (
                         <motion.div
                           initial={{ height: 0, opacity: 0 }}
                           animate={{ height: 'auto', opacity: 1 }}
                           exit={{ height: 0, opacity: 0 }}
                           className="overflow-hidden ml-[36px] pl-4 pr-2"
                         >
                           <div className="py-3 mt-1 mb-3 bg-[var(--bg-overlay)] border border-[var(--b2)] rounded-[8px] px-4 space-y-3">
                              
                              <div className="flex justify-between items-center">
                                 <div className="text-[12px] text-[var(--t2)] font-medium">Transaction Hash</div>
                                 <div className="flex items-center gap-2">
                                    <span className="font-mono text-[11px] text-[var(--t1)]">{truncate(tx.hash, 8)}</span>
                                    <button onClick={(e) => handleCopy(e, tx.hash)} className="text-[var(--t3)] hover:text-[var(--indigo)] transition-colors">
                                       {copiedHash === tx.hash ? <Check className="w-[12px] h-[12px] text-[var(--green)]" /> : <Copy className="w-[12px] h-[12px]" />}
                                    </button>
                                 </div>
                              </div>

                              <div className="flex justify-between items-center">
                                 <div className="text-[12px] text-[var(--t2)] font-medium">Fee Charged</div>
                                 <div className="font-mono text-[11px] text-[var(--t1)]">{tx.fee ? `${tx.fee} stroops` : '-'}</div>
                              </div>
                              
                              <div className="flex justify-between items-center">
                                 <div className="text-[12px] text-[var(--t2)] font-medium">Operation Count</div>
                                 <div className="font-mono text-[11px] text-[var(--t1)]">{tx.operationCount || tx.txOps?.length || 1}</div>
                              </div>

                           </div>
                         </motion.div>
                       )}
                     </AnimatePresence>
                   </motion.div>
                 );
               })}
             </AnimatePresence>
           </motion.div>
         )}
      </div>

    </div>
  );
}
