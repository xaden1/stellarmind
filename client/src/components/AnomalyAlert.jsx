import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getSeverityColor } from '../utils/formatters';

export default function AnomalyAlert({ anomalies = [] }) {
  const [expanded, setExpanded] = useState(null);

  if (!anomalies.length) {
    return (
      <div className="glass-card p-5 flex flex-col items-center justify-center text-center" style={{ minHeight: 180 }}>
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center mb-3"
          style={{ background: 'rgba(0,212,180,0.15)' }}
        >
          <svg className="w-6 h-6" fill="none" stroke="#00D4B4" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="font-display font-semibold text-sm text-white mb-1">All Clear!</h3>
        <p className="text-xs text-slate-400">No unusual activity detected in your wallet.</p>
      </div>
    );
  }

  return (
    <div className="glass-card p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-slate-400">Anomaly Alerts</h3>
        <span
          className="text-xs px-2 py-0.5 rounded-full font-medium"
          style={{ background: 'rgba(239,68,68,0.15)', color: '#EF4444' }}
        >
          {anomalies.length} detected
        </span>
      </div>

      <div className="space-y-2">
        {anomalies.map((a, i) => {
          const color = getSeverityColor(a.severity);
          const isExpanded = expanded === i;
          return (
            <motion.div
              key={i}
              layout
              className="rounded-xl p-3 cursor-pointer hover:bg-opacity-80 transition-colors"
              style={{ background: '#0D1425', border: `1px solid ${color}30` }}
              onClick={() => setExpanded(isExpanded ? null : i)}
            >
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex-shrink-0">
                  <div
                    className="w-2.5 h-2.5 rounded-full"
                    style={{
                      background: color,
                      boxShadow: a.severity === 'high' ? `0 0 8px ${color}` : 'none',
                      animation: a.severity === 'high' ? 'pulse-glow 2s ease-in-out infinite' : 'none'
                    }}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-xs text-slate-500">{a.date}</span>
                    <span
                      className="text-xs px-1.5 py-0.5 rounded font-medium"
                      style={{ color, background: `${color}20` }}
                    >
                      {a.severity}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">{a.description}</p>
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-2"
                      >
                        <p className="text-xs text-slate-500">
                          This pattern was flagged as {a.severity} severity. Review your transaction history for context.
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                <svg
                  className="w-4 h-4 text-slate-600 flex-shrink-0 transition-transform"
                  style={{ transform: isExpanded ? 'rotate(180deg)' : 'none' }}
                  fill="none" stroke="currentColor" viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
