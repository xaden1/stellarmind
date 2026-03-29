import { useState } from 'react';
import { motion } from 'framer-motion';

export default function PersonalityCard({ personality = {}, monthlyTrend = 'stable' }) {
  const [flipped, setFlipped] = useState(false);

  const trendConfig = {
    improving: { icon: '↑', label: 'Improving', color: '#00D4B4' },
    stable: { icon: '→', label: 'Stable', color: '#7C5CFC' },
    declining: { icon: '↓', label: 'Declining', color: '#F97316' }
  };
  const trend = trendConfig[monthlyTrend] || trendConfig.stable;

  return (
    <div
      className="relative cursor-pointer"
      style={{ perspective: '1000px', height: '100%', minHeight: 220 }}
      onClick={() => setFlipped(!flipped)}
    >
      <motion.div
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.5, ease: 'easeInOut' }}
        style={{ transformStyle: 'preserve-3d', position: 'relative', width: '100%', height: '100%' }}
      >
        {/* Front */}
        <div
          className="gradient-border absolute inset-0 glass-card p-5 flex flex-col items-center justify-center text-center"
          style={{ backfaceVisibility: 'hidden' }}
        >
          <div className="text-5xl mb-3">{personality.emoji || '🧭'}</div>
          <h3 className="gradient-text font-display font-bold text-lg mb-2">
            {personality.archetype || 'The Explorer'}
          </h3>
          <p className="text-slate-400 text-xs leading-relaxed mb-4">
            {personality.description || 'Your financial journey on Stellar is unique.'}
          </p>
          <div
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium"
            style={{ background: `${trend.color}20`, color: trend.color, border: `1px solid ${trend.color}40` }}
          >
            <span>{trend.icon}</span>
            <span>{trend.label}</span>
          </div>
          <p className="text-slate-600 text-xs mt-3">Tap to flip →</p>
        </div>

        {/* Back */}
        <div
          className="gradient-border absolute inset-0 glass-card p-5 flex flex-col items-center justify-center text-center"
          style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
        >
          <h3 className="font-display font-bold text-sm gradient-text mb-4">Your Financial DNA</h3>
          <div className="space-y-3 w-full">
            {[
              { label: 'Risk Appetite', value: personality.archetype?.includes('Trader') ? 'High' : 'Moderate', color: '#F97316' },
              { label: 'Time Horizon', value: personality.archetype?.includes('Hodler') ? 'Long-term' : 'Mixed', color: '#00D4B4' },
              { label: 'Active Style', value: personality.archetype?.includes('Philanthropist') ? 'Giving' : 'Earning', color: '#7C5CFC' },
            ].map(({ label, value, color }) => (
              <div key={label} className="flex justify-between items-center">
                <span className="text-xs text-slate-500">{label}</span>
                <span className="text-xs font-medium px-2 py-0.5 rounded" style={{ color, background: `${color}20` }}>{value}</span>
              </div>
            ))}
          </div>
          <p className="text-slate-600 text-xs mt-4">Tap to flip back</p>
        </div>
      </motion.div>
    </div>
  );
}
