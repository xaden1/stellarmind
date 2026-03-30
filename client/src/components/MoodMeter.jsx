import React from 'react';
import { motion } from 'framer-motion';
import { useCountUp } from '../hooks/useCountUp';

export default function MoodMeter({ moodScore = 50, moodLabel = 'Stable' }) {
  const animatedScore = useCountUp(moodScore, 1200);

  const getMoodColor = (label) => {
    switch (label?.toLowerCase()) {
      case 'thriving': return 'var(--cyan)';
      case 'stable': return 'var(--green)';
      case 'cautious': return 'var(--amber)';
      case 'volatile': return 'var(--red)';
      default: return 'var(--t3)';
    }
  };
  
  const color = getMoodColor(moodLabel);
  const clampedScore = Math.max(0, Math.min(100, moodScore));

  return (
    <div className="card w-full p-6 flex flex-col h-full justify-between">
      
      {/* Header */}
      <div className="flex flex-col items-center">
        <h2 className="font-display text-[16px] font-bold text-[var(--t1)] m-0">Financial Mood</h2>
        <p className="font-body text-[12px] text-[var(--t3)] mt-1">Based on recent activity patterns</p>
      </div>

      {/* Mood Label */}
      <div className="flex justify-center my-6">
        <motion.div
           initial={{ opacity: 0, scale: 0.8 }}
           animate={{ opacity: 1, scale: 1 }}
           transition={{ duration: 0.5, ease: 'easeOut' }}
           className="font-display font-bold text-[32px]"
           style={{ color }}
        >
          {moodLabel}
        </motion.div>
      </div>

      {/* Track Container */}
      <div className="w-full flex flex-col mt-4">
        <div className="relative w-full px-[9px] mb-8">
           <div className="w-full h-[10px] rounded-full" style={{ background: 'linear-gradient(90deg, var(--t3), var(--amber), var(--green), var(--cyan))' }} />
           <motion.div 
             className="mood-indicator"
             initial={{ left: '0%' }}
             whileInView={{ left: `calc(${clampedScore}% - 9px)` }}
             viewport={{ once: true }}
             transition={{ duration: 1.2, ease: [0.34, 1.56, 0.64, 1] }}
           />
        </div>

        {/* Score Badges */}
        <div className="relative w-full h-[20px] mb-8">
           <span className="absolute left-[0%] -translate-x-1/2 text-[11px] font-medium text-[var(--t3)]">Dormant</span>
           <span className="absolute left-[33%] -translate-x-1/2 text-[11px] font-medium text-[var(--amber)]">Cautious</span>
           <span className="absolute left-[66%] -translate-x-1/2 text-[11px] font-medium text-[var(--green)]">Stable</span>
           <span className="absolute left-[100%] -translate-x-1/2 text-[11px] font-medium text-[var(--cyan)]">Thriving</span>
        </div>
      </div>

      {/* Bottom row */}
      <div className="flex flex-col items-center justify-center mt-auto pt-4 border-t border-[var(--b1)]">
        <div className="flex items-baseline gap-1">
           <span className="font-mono text-[40px] font-semibold text-grad">{animatedScore}</span>
           <span className="font-display text-[20px] text-[var(--t3)]">/ 100</span>
        </div>
        <p className="font-body text-[12px] text-[var(--t3)] mt-1">Your mood score</p>
      </div>

    </div>
  );
}
