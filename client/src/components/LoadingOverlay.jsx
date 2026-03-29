import { motion, AnimatePresence } from 'framer-motion';
import { Check, Loader2 } from 'lucide-react';

const STEPS = [
  'Fetching wallet from Stellar Horizon',
  'Running AI analysis with Claude',
  'Building your financial profile',
];

export default function LoadingOverlay({ currentStep = 0 }) {
  const messages = [
    'Connecting to Stellar testnet...',
    'Analyzing transactions with AI...',
    'Assembling your dashboard...',
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center"
      style={{ background: 'var(--bg-primary)' }}
    >
      {/* Gradient orbs */}
      <div
        className="absolute w-96 h-96 rounded-full blur-3xl opacity-10 pointer-events-none"
        style={{ background: 'var(--purple)', top: '20%', left: '30%' }}
      />
      <div
        className="absolute w-80 h-80 rounded-full blur-3xl opacity-10 pointer-events-none"
        style={{ background: 'var(--teal)', bottom: '20%', right: '30%' }}
      />

      <div className="relative z-10 flex flex-col items-center gap-8 px-6 max-w-md w-full">
        {/* Logo */}
        <div className="flex flex-col items-center gap-3">
          <div
            className="w-20 h-20 rounded-2xl flex items-center justify-center font-display font-bold text-3xl text-white pulse-ring"
            style={{ background: 'linear-gradient(135deg, var(--purple), var(--teal))' }}
          >
            SM
          </div>
          <h1 className="font-display font-bold text-2xl text-white">StellarMind</h1>
        </div>

        {/* Animated message */}
        <AnimatePresence mode="wait">
          <motion.p
            key={currentStep}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="text-sm text-center"
            style={{ color: 'var(--text-2)' }}
          >
            {messages[currentStep] || messages[0]}
          </motion.p>
        </AnimatePresence>

        {/* Steps */}
        <div className="w-full space-y-3">
          {STEPS.map((step, i) => {
            const done = i < currentStep;
            const active = i === currentStep;
            return (
              <div key={i} className="flex items-center gap-3">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{
                    background: done ? 'rgba(0,212,180,0.2)' : active ? 'rgba(124,92,252,0.2)' : 'rgba(255,255,255,0.05)',
                    border: `1px solid ${done ? 'var(--teal)' : active ? 'var(--purple)' : 'var(--border-hover)'}`,
                  }}
                >
                  {done ? (
                    <Check className="w-4 h-4" style={{ color: 'var(--teal)' }} />
                  ) : active ? (
                    <Loader2 className="w-4 h-4 animate-spin" style={{ color: 'var(--purple)' }} />
                  ) : (
                    <div className="w-2 h-2 rounded-full" style={{ background: 'var(--text-3)' }} />
                  )}
                </div>
                <span
                  className="text-sm"
                  style={{
                    color: done ? 'var(--teal)' : active ? 'var(--text-1)' : 'var(--text-3)',
                    fontWeight: active ? 500 : 400,
                  }}
                >
                  {step}
                </span>
              </div>
            );
          })}
        </div>

        {/* Progress bar */}
        <div className="w-full h-1 rounded-full overflow-hidden" style={{ background: 'var(--border)' }}>
          <motion.div
            className="h-full rounded-full"
            style={{ background: 'linear-gradient(90deg, var(--purple), var(--teal))' }}
            initial={{ width: '0%' }}
            animate={{ width: `${((currentStep + 1) / 3) * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>

        <p className="text-xs" style={{ color: 'var(--text-3)' }}>
          Powered by Stellar Horizon + Claude AI • This takes about 10 seconds
        </p>
      </div>
    </div>
  );
}
