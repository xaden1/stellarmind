import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { getScoreColor, getScoreLabel } from '../utils/formatters';

export default function HealthScoreRing({ score = 0, breakdown = {} }) {
  const circumference = 2 * Math.PI * 70; // r=70
  const offset = circumference - (score / 100) * circumference;
  const color = getScoreColor(score);
  const label = getScoreLabel(score);

  const subScores = [
    { label: 'Stability', value: breakdown.stability || 0, color: '#00D4B4' },
    { label: 'Activity', value: breakdown.activity || 0, color: '#7C5CFC' },
    { label: 'Growth', value: breakdown.growth || 0, color: '#F59E0B' },
    { label: 'Risk', value: breakdown.risk || 0, color: '#F97316' },
  ];

  return (
    <div className="glass-card p-6 flex flex-col items-center">
      <h3 className="text-sm font-medium text-slate-400 mb-4">Health Score</h3>

      <div className="relative" style={{ width: 160, height: 160 }}>
        <svg width="160" height="160" viewBox="0 0 160 160" className="-rotate-90">
          {/* Background ring */}
          <circle
            cx="80" cy="80" r="70"
            fill="none"
            stroke="#1E293B"
            strokeWidth="12"
          />
          {/* Score ring */}
          <motion.circle
            cx="80" cy="80" r="70"
            fill="none"
            stroke={color}
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
            style={{ filter: `drop-shadow(0 0 8px ${color}60)` }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            className="font-display font-bold text-5xl"
            style={{ color }}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            {score}
          </motion.span>
          <span className="text-xs text-slate-400 mt-1">{label}</span>
        </div>
      </div>

      {/* Sub-scores */}
      <div className="grid grid-cols-2 gap-2 mt-4 w-full">
        {subScores.map(({ label, value, color }) => (
          <div key={label} className="flex items-center gap-2 px-2 py-1.5 rounded-lg" style={{ background: '#0D1425' }}>
            <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: color }} />
            <span className="text-xs text-slate-400">{label}</span>
            <span className="text-xs font-medium text-white ml-auto">{value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
