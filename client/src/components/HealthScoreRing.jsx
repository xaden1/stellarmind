import React from 'react';
import { motion } from 'framer-motion';
import { useCountUp } from '../hooks/useCountUp';

export default function HealthScoreRing({ score = 0, breakdown = {} }) {
  const animatedScore = useCountUp(score, 1500);

  const R = 80;
  const CIRCUMFERENCE = 2 * Math.PI * R;
  // Let Framer Motion animate the strokeDashoffset
  const offset = CIRCUMFERENCE - (score / 100) * CIRCUMFERENCE;

  let colorBase = 'var(--indigo)';
  let colorEnd = 'var(--cyan)';
  let badgeClass = 'badge-indigo';
  let badgeText = 'Excellent';

  if (score < 40) {
    colorBase = 'var(--red)';
    colorEnd = 'var(--red)';
    badgeClass = 'badge-red';
    badgeText = 'At Risk';
  } else if (score < 70) {
    colorBase = 'var(--amber)';
    colorEnd = 'var(--amber)';
    badgeClass = 'badge-amber';
    badgeText = 'Fair';
  } else if (score < 90) {
    badgeText = 'Good';
  }

  const subScores = [
    { label: 'Stability', value: breakdown.stability || 0, color: 'var(--cyan)' },
    { label: 'Activity', value: breakdown.activity || 0, color: 'var(--indigo)' },
    { label: 'Growth', value: breakdown.growth || 0, color: 'var(--green)' },
    { label: 'Risk', value: breakdown.risk || 0, color: 'var(--amber)' },
  ];

  return (
    <div className="card flex flex-col items-center justify-center p-6 h-full">
      
      {/* Container for SVG and inner content */}
      <div className="relative w-[200px] h-[200px] mb-6 flex items-center justify-center">
        <svg width="200" height="200" viewBox="0 0 200 200" className="absolute inset-0">
          <defs>
            <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={colorBase} />
              <stop offset="100%" stopColor={colorEnd} />
            </linearGradient>
          </defs>

          {/* Outer decorative ring */}
          <circle
            cx="100" cy="100" r="90"
            fill="none"
            stroke="var(--b1)"
            strokeWidth="1"
            strokeDasharray="4 8"
            style={{ animation: 'orbit-cw 20s linear infinite', transformOrigin: 'center' }}
          />

          {/* Background circle */}
          <circle
            cx="100" cy="100" r={R}
            fill="none"
            stroke="var(--bg-overlay)"
            strokeWidth="14"
          />

          {/* Score arc */}
          <motion.circle
            cx="100" cy="100" r={R}
            fill="none"
            stroke="url(#scoreGrad)"
            strokeWidth="14"
            strokeLinecap="round"
            className="ring-arc"
            strokeDasharray={CIRCUMFERENCE}
            initial={{ strokeDashoffset: CIRCUMFERENCE }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
          />
        </svg>

        {/* Inner Content */}
        <div className="relative z-10 flex flex-col items-center mt-2">
          <div className="flex items-baseline">
            <span className="font-display font-extrabold text-[52px]" style={{
              background: `linear-gradient(135deg, ${colorBase}, ${colorEnd})`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              {animatedScore}
            </span>
            <span className="font-display font-normal text-[18px] text-[var(--t3)] ml-1">/ 100</span>
          </div>
          <div className={`badge ${badgeClass} mt-1`}>{badgeText}</div>
          <div className="text-[12px] text-[var(--t2)] uppercase tracking-wider mt-2 font-body font-medium">
            Health Score
          </div>
        </div>
      </div>

      {/* 2x2 Grid details */}
      <div className="grid grid-cols-2 gap-4 w-[240px]">
        {subScores.map(({ label, value, color }) => (
          <div key={label} className="flex flex-col border-l-[4px] pl-3 py-1 bg-[rgba(255,255,255,0.02)] rounded-r-md" style={{ borderLeftColor: color }}>
            <span className="text-[11px] uppercase text-[var(--t3)] tracking-wider font-semibold">{label}</span>
            <span className="font-mono text-[18px] font-medium mt-1 mb-2" style={{ color }}>{value}</span>
            <div className="w-[60px] h-[3px] bg-[var(--bg-overlay)] rounded-full overflow-hidden">
               <motion.div 
                 className="h-full rounded-full" 
                 style={{ background: color }}
                 initial={{ width: 0 }}
                 whileInView={{ width: `${value}%` }}
                 viewport={{ once: true }}
                 transition={{ duration: 1, ease: 'easeOut' }}
               />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
