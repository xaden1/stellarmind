import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, TrendingUp, TrendingDown, Minus } from 'lucide-react';

export default function PersonalityCard({ personality = {}, monthlyTrend = 'stable' }) {
  const archetypeColors = {
    'The Hodler': 'var(--indigo)',
    'The Trader': 'var(--amber)',
    'The Philanthropist': 'var(--cyan)',
    'The Builder': 'var(--violet)',
    'The Explorer': 'var(--green)',
    'The Whale-in-Training': '#F59E0B',
  };

  const archetype = personality.archetype || 'The Explorer';
  const color = archetypeColors[archetype] || 'var(--indigo)';
  
  const isWhale = archetype === 'The Whale-in-Training';

  const trendConfig = {
    improving: { icon: ArrowRight, class: 'badge-green', label: '↑ Improving' },
    stable: { icon: Minus, class: 'badge-indigo', label: '→ Stable' },
    declining: { icon: TrendingDown, class: 'badge-red', label: '↓ Declining' }
  };
  const trend = trendConfig[monthlyTrend] || trendConfig.stable;

  // Derive DNA scores (0-100) purely for visual purposes
  const getDnaScores = (type) => {
    switch (type) {
      case 'The Hodler': return [20, 10, 40, 30];
      case 'The Trader': return [90, 95, 80, 70];
      case 'The Explorer': return [60, 50, 90, 80];
      case 'The Builder': return [40, 60, 50, 95];
      case 'The Philanthropist': return [50, 40, 60, 90];
      case 'The Whale-in-Training': return [80, 70, 85, 60];
      default: return [50, 50, 50, 50];
    }
  };
  const scores = getDnaScores(archetype);

  return (
    <div className="w-full h-full relative" style={{ perspective: 1000, minHeight: 320 }}>
      {/* Front Face Hover triggers rotation of the inner container via CSS group */}
      <div className="w-full h-full group">
         <div className="w-full h-full relative transition-[transform] duration-[0.6s] ease-[cubic-bezier(0.16,1,0.3,1)]" 
              style={{ transformStyle: 'preserve-3d' }}
         >
           <style>{`
             .group:hover > div { transform: rotateY(180deg); }
           `}</style>
           
           {/* FRONT FACE */}
           <div className="absolute inset-0 card personality-pattern card-glow-indigo p-6 flex flex-col items-center justify-between"
                style={{ backfaceVisibility: 'hidden' }}>
              
              <div className="w-full flex justify-end">
                 <div className={`badge ${trend.class}`}>{trend.label}</div>
              </div>

              <div className="flex flex-col items-center justify-center flex-1">
                 <div className="text-[64px] animate-float drop-shadow-[0_0_20px_rgba(255,255,255,0.2)]">
                   {personality.emoji || '🧭'}
                 </div>
                 
                 <h2 className={`font-display font-bold text-[22px] mt-4 mb-2 ${isWhale ? 'text-grad-gold' : ''}`}
                     style={!isWhale ? { color } : {}}>
                   {archetype}
                 </h2>
                 
                 <p className="font-body text-[14px] text-[var(--t2)] text-center w-full max-w-[240px] leading-[1.6]">
                   {personality.description || 'You love trying new things on the network. Your wallet shows curiosity.'}
                 </p>
              </div>

              <div className="w-full flex justify-center mt-2">
                 <div className="flex items-center gap-1 text-[var(--t3)] text-[12px] font-medium tracking-wide">
                    Your Financial DNA <ArrowRight className="w-3 h-3 ml-1" />
                 </div>
              </div>
           </div>

           {/* BACK FACE */}
           <div className="absolute inset-0 card p-6 flex flex-col items-center justify-center"
                style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}>
                
                <h3 className="font-display text-[16px] text-grad font-bold mb-6">Financial DNA Breakdown</h3>
                
                <div className="w-full space-y-5">
                   {[
                     { label: 'Risk Tolerance', val: scores[0] },
                     { label: 'Trading Freq', val: scores[1] },
                     { label: 'Asset Diversity', val: scores[2] },
                     { label: 'Network Engagement', val: scores[3] },
                   ].map((item, i) => (
                     <div key={i} className="flex flex-col gap-1.5">
                       <div className="flex justify-between items-center text-[12px] font-medium text-[var(--t2)] uppercase tracking-wide">
                          <span>{item.label}</span>
                          <span>{item.val >= 70 ? 'High' : item.val >= 40 ? 'Med' : 'Low'}</span>
                       </div>
                       <div className="w-full h-[4px] bg-[var(--bg-overlay)] rounded-full overflow-hidden flex">
                          <motion.div 
                             className="h-full rounded-full"
                             style={{ background: `linear-gradient(90deg, ${color}, var(--cyan))` }}
                             initial={{ width: 0 }}
                             whileInView={{ width: `${item.val}%` }}
                             transition={{ duration: 1, ease: 'easeOut' }}
                             viewport={{ once: true }}
                          />
                       </div>
                     </div>
                   ))}
                </div>
           </div>
         </div>
      </div>
    </div>
  );
}
