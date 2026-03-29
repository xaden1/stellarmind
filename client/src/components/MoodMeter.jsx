import { motion } from 'framer-motion';
import { getMoodColor } from '../utils/formatters';

export default function MoodMeter({ moodScore = 50, moodLabel = 'Stable' }) {
  const color = getMoodColor(moodLabel);
  const clampedScore = Math.max(0, Math.min(100, moodScore));

  return (
    <div className="glass-card p-5">
      <h3 className="text-sm font-medium text-slate-400 mb-1">Financial Mood</h3>
      <div className="flex items-baseline gap-2 mb-4">
        <span className="font-display font-bold text-2xl" style={{ color }}>{moodLabel}</span>
      </div>

      {/* Gradient bar */}
      <div className="relative mb-6">
        <div className="mood-bar w-full" />
        <motion.div
          className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2 border-white shadow-lg"
          style={{ background: color, left: `calc(${clampedScore}% - 8px)` }}
          initial={{ left: '0%' }}
          animate={{ left: `calc(${clampedScore}% - 8px)` }}
          transition={{ duration: 1, ease: 'easeOut' }}
        />
      </div>

      {/* Labels */}
      <div className="flex justify-between text-xs text-slate-600 mb-4">
        <span>Volatile</span>
        <span>Cautious</span>
        <span>Stable</span>
        <span>Thriving</span>
      </div>

      {/* Score number */}
      <div className="flex items-center justify-between">
        <p className="text-xs text-slate-500">Based on recent activity patterns</p>
        <span
          className="text-sm font-bold px-2 py-0.5 rounded-lg"
          style={{ color, background: `${color}20` }}
        >
          {clampedScore}/100
        </span>
      </div>
    </div>
  );
}
