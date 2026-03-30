import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Loader2 } from 'lucide-react';

const CYCLE_MESSAGES = [
  { text: 'Connecting to Stellar Horizon...', color: 'var(--indigo)' },
  { text: 'Fetching your transaction history...', color: 'var(--cyan)' },
  { text: 'Running AI analysis...', color: 'var(--amber)' },
  { text: 'Calculating your health score...', color: 'var(--green)' },
  { text: 'Assigning your wallet personality...', color: 'var(--violet)' },
  { text: 'Building your dashboard...', color: 'var(--indigo)' },
];

export default function LoadingOverlay({ currentStep = 0 }) {
  const [msgIdx, setMsgIdx] = useState(0);

  useEffect(() => {
    const intNum = setInterval(() => {
      setMsgIdx((prev) => (prev + 1) % CYCLE_MESSAGES.length);
    }, 2000);
    return () => clearInterval(intNum);
  }, []);

  const progressPct = currentStep === 0 ? 33 : currentStep === 1 ? 66 : 100;

  const STEPS = [
    'Connect',
    'Analyze',
    'Dashboard'
  ];

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[var(--bg-void)]">
      {/* Orbs */}
      <div 
        className="absolute top-[-100px] left-[-100px] w-[400px] h-[400px] rounded-full blur-[100px] pointer-events-none"
        style={{ background: 'var(--indigo)', animation: 'glowPulse 4s infinite ease-in-out' }} 
      />
      <div 
        className="absolute bottom-[-100px] right-[-100px] w-[400px] h-[400px] rounded-full blur-[100px] pointer-events-none"
        style={{ background: 'var(--cyan)', animation: 'glowPulse 4s infinite ease-in-out 1s' }} 
      />

      <div className="relative z-10 flex flex-col items-center gap-10">
        
        {/* Logo Mark + Wordmark */}
        <div className="flex flex-col items-center gap-4 animate-float">
          <div className="relative w-[72px] h-[72px] rounded-full flex items-center justify-center shadow-[var(--shadow-glow-indigo)]">
             <div className="absolute inset-0 rounded-full border-[2px] border-transparent" 
                  style={{
                    background: 'conic-gradient(var(--indigo), var(--cyan), var(--indigo))',
                    WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                    WebkitMaskComposite: 'xor',
                    maskComposite: 'exclude',
                    animation: 'orbit-cw 3s linear infinite'
                  }} 
             />
             <div className="w-[68px] h-[68px] rounded-full bg-[var(--bg-surface)] flex items-center justify-center">
                <span className="font-display font-bold text-[24px] text-white">SM</span>
             </div>
          </div>
          <h1 className="font-display font-bold text-[28px] text-grad m-0">StellarMind</h1>
        </div>

        {/* Animated Loading Message */}
        <div className="h-[30px] flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={msgIdx}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="flex items-center gap-2"
            >
              <div className="w-[8px] h-[8px] rounded-full animate-pulseDot" style={{ background: CYCLE_MESSAGES[msgIdx].color }} />
              <span className="font-mono text-[15px] text-[var(--t2)]">{CYCLE_MESSAGES[msgIdx].text}</span>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Step Indicators */}
        <div className="flex flex-col gap-4 w-[240px]">
          {STEPS.map((stepMsg, i) => {
            const isDone = i < currentStep;
            const isActive = i === currentStep;
            return (
              <div key={i} className="flex items-center gap-4">
                <div className="w-[32px] h-[32px] rounded-full flex items-center justify-center shrink-0 border border-solid relative"
                     style={{ 
                       borderColor: isActive ? 'var(--indigo)' : isDone ? 'var(--green)' : 'var(--b2)',
                       background: isActive ? 'var(--indigo-dim)' : isDone ? 'var(--green-dim)' : 'transparent' 
                     }}>
                  
                  {isActive && (
                    <div className="absolute inset-0 rounded-full border-[2px] border-[var(--indigo)] border-t-transparent animate-spin opacity-50" />
                  )}

                  {isDone ? (
                    <Check className="w-[14px] h-[14px] text-[var(--green)] animate-scaleUp" />
                  ) : isActive ? (
                    <div className="w-[6px] h-[6px] rounded-full bg-[var(--indigo)] animate-pulseDot" />
                  ) : null}
                </div>
                <span className={`text-[14px] ${isDone ? 'line-through opacity-50' : ''}`}
                      style={{ color: isActive ? 'var(--t1)' : isDone ? 'var(--t2)' : 'var(--t3)' }}>
                  {stepMsg}
                  {isActive && <span className="inline-block ml-1">...</span>}
                </span>
              </div>
            );
          })}
        </div>

        {/* Progress Bar */}
        <div className="w-[200px] h-[3px] bg-[var(--bg-overlay)] rounded-[10px] overflow-hidden">
          <div 
             className="h-full rounded-[10px]"
             style={{
               background: 'linear-gradient(90deg, var(--indigo), var(--cyan))',
               width: `${progressPct}%`,
               transition: 'width 0.8s cubic-bezier(0.16,1,0.3,1)'
             }}
          />
        </div>

        {/* Footer text */}
        <div className="mt-8 text-[11px] text-[var(--t3)] tracking-wide uppercase">
          Powered by Stellar + Claude AI
        </div>

      </div>
    </div>
  );
}
