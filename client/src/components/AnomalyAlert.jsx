import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Zap } from 'lucide-react';

export default function AnomalyAlert({ anomalies = [] }) {
  const [expandedIndices, setExpandedIndices] = useState([]);

  const toggleExpand = (i) => {
    setExpandedIndices(prev => 
      prev.includes(i) ? prev.filter(x => x !== i) : [...prev, i]
    );
  };

  const getSeverityStyle = (severity) => {
    const s = severity?.toLowerCase();
    if (s === 'high') return { color: 'var(--red)', badge: 'badge-red' };
    if (s === 'low') return { color: 'var(--indigo)', badge: 'badge-indigo' };
    return { color: 'var(--amber)', badge: 'badge-amber' }; // medium default
  };

  if (!anomalies || anomalies.length === 0) {
    return (
      <div className="card w-full h-full min-h-[260px] flex flex-col items-center justify-center text-center p-6">
        <motion.div
           initial={{ opacity: 0, scale: 0.8 }}
           animate={{ opacity: 1, scale: 1 }}
           transition={{ duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
           className="flex flex-col items-center"
        >
          <div className="w-[80px] h-[80px] rounded-full flex items-center justify-center mb-6 shadow-[var(--shadow-glow-cyan)]"
               style={{ background: 'var(--green-dim)', border: '1px solid rgba(16,185,129,0.2)' }}>
            <ShieldCheck className="w-[48px] h-[48px] text-[var(--green)]" />
          </div>
          <h2 className="font-display font-medium text-[20px] text-[var(--green)] mb-2 m-0">All Clear</h2>
          <p className="font-body text-[14px] text-[var(--t2)] mb-4 w-full max-w-[200px]">
             No unusual activity detected in your wallet.
          </p>
          <div className="badge badge-green">Healthy</div>
        </motion.div>
      </div>
    );
  }

  const hasHigh = anomalies.some(a => a.severity?.toLowerCase() === 'high');

  const containerVars = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };
  const itemVars = {
    hidden: { opacity: 0, x: -20 },
    show: { opacity: 1, x: 0, transition: { ease: [0.16, 1, 0.3, 1] } }
  };

  return (
    <div className="card w-full h-[420px] flex flex-col p-6 overflow-hidden">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-6 shrink-0">
        <h2 className="font-display font-bold text-[16px] text-[var(--t1)] m-0 flex items-center gap-2">
           <Zap className="w-[18px] h-[18px] text-[var(--amber)]" />
           Anomaly Alerts
        </h2>
        <div className={`badge ${hasHigh ? 'badge-red' : 'badge-amber'}`}>
           {anomalies.length} detected
        </div>
      </div>

      {/* List */}
      <motion.div 
        variants={containerVars} initial="hidden" animate="show"
        className="flex-1 overflow-y-auto pr-2 space-y-3 [&::-webkit-scrollbar]:w-[4px] [&::-webkit-scrollbar-thumb]:bg-[var(--indigo)] [&::-webkit-scrollbar-track]:bg-transparent"
      >
        {anomalies.map((anomaly, idx) => {
          const { color, badge } = getSeverityStyle(anomaly.severity);
          const isHigh = anomaly.severity?.toLowerCase() === 'high';
          const isExpanded = expandedIndices.includes(idx);

          return (
            <motion.div 
              key={idx}
              variants={itemVars}
              className="w-full bg-[var(--bg-elevated)] border-l-[3px] rounded-[0_8px_8px_0] flex flex-col p-4 shadow-md transition-shadow hover:shadow-[var(--shadow-card)]"
              style={{ borderLeftColor: color }}
            >
              
              <div className="flex justify-between items-center w-full mb-2">
                <div className="flex items-center gap-3">
                  <div className={`w-[8px] h-[8px] rounded-full ${isHigh ? 'animate-pulseDot' : ''}`} style={{ background: color }} />
                  <div className={`badge ${badge}`}>{anomaly.severity}</div>
                </div>
                <div className="font-mono text-[11px] text-[var(--t3)] leading-none">
                  {anomaly.date}
                </div>
              </div>

              <div className="font-body text-[14px] text-[var(--t1)] leading-[1.6]">
                 {anomaly.description}
              </div>

              <button 
                onClick={() => toggleExpand(idx)}
                className="text-[12px] text-[var(--t3)] hover:text-[var(--t1)] transition-colors self-start mt-3 cursor-pointer"
              >
                {isExpanded ? '↑ Hide details' : '↓ What this means'}
              </button>

              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: 'easeOut' }}
                    className="overflow-hidden"
                  >
                    <div className="pt-3 mt-2 border-t border-[rgba(255,255,255,0.05)] text-[13px] text-[var(--t2)] leading-[1.6] font-body bg-[rgba(0,0,0,0.1)] p-3 rounded-[6px]">
                       This pattern was flagged as {anomaly.severity || 'medium'} severity due to a significant baseline deviation. 
                       {isHigh ? " Immediate review of this transaction is recommended to ensure your funds are safe." : " It may be normal behavior, but is worth reviewing."}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              
            </motion.div>
          );
        })}
      </motion.div>

    </div>
  );
}
