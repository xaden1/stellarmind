import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import WalletConnect from '../components/WalletConnect';

const FEATURES = [
  { icon: '🏥', title: 'Financial Health Score', desc: 'Know your wallet\'s on-chain health from 0 to 100 — broken down into Stability, Activity, Growth, and Risk.' },
  { icon: '🧬', title: 'Wallet Personality', desc: 'Discover your financial archetype: The Hodler, The Trader, The Explorer, and more.' },
  { icon: '💬', title: 'Ask Your Wallet', desc: 'Chat with your transaction history in plain English. "Was March my best month?"' },
  { icon: '📊', title: 'Behavioral Heatmap', desc: 'See your activity patterns over the past year — like GitHub but for your Stellar wallet.' },
  { icon: '⚠️', title: 'Anomaly Detection', desc: 'AI flags unusual patterns so you always know when something unexpected happens.' },
  { icon: '📁', title: 'Monthly Reports', desc: 'One-click AI-generated PDF reports with insights, highlights, and recommendations.' },
];

const STEPS = [
  { n: '01', label: 'Connect', desc: 'Link your Freighter wallet in one click — no sign-up, no passwords.' },
  { n: '02', label: 'Analyze', desc: 'Claude AI reads your Stellar history and builds your financial profile.' },
  { n: '03', label: 'Understand', desc: 'Explore your personality, health score, and data-driven insights.' },
];

const STATS = ['Built on Stellar', 'Powered by Claude AI', '100% Browser-Based', 'Testnet Ready'];

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.55, delay },
});

export default function Landing({ onConnect, isConnecting, connectError }) {
  return (
    <div style={{ minHeight: '100vh' }}>
      {/* Hero */}
      <section className="relative flex flex-col items-center justify-center text-center px-6 overflow-hidden" style={{ minHeight: '100vh', paddingTop: 80 }}>
        {/* Animated rings */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          {[260, 400, 540].map((size, i) => (
            <div
              key={i}
              className="absolute rounded-full border"
              style={{
                width: size, height: size,
                borderColor: i % 2 === 0 ? 'rgba(124,92,252,0.12)' : 'rgba(0,212,180,0.08)',
                animation: `orbit ${12 + i * 4}s linear infinite ${i % 2 ? 'reverse' : ''}`,
                transformOrigin: 'center',
              }}
            />
          ))}
        </div>

        {/* Star field */}
        <div className="absolute inset-0 pointer-events-none">
          {Array.from({ length: 30 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-0.5 h-0.5 rounded-full bg-white"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                opacity: Math.random() * 0.5 + 0.1,
                animation: `blink ${2 + Math.random() * 3}s ease-in-out infinite ${Math.random() * 2}s`,
              }}
            />
          ))}
        </div>

        <div className="relative z-10 flex flex-col items-center gap-6 max-w-3xl">
          {/* Badge */}
          <motion.div {...fadeUp(0)}>
            <span className="badge badge-purple">✦ Stellar Monthly Builder Challenge 2026</span>
          </motion.div>

          {/* Headline */}
          <motion.h1 {...fadeUp(0.1)} className="font-display font-bold text-white" style={{ fontSize: 'clamp(38px,7vw,72px)', letterSpacing: '-2px', lineHeight: 1.1 }}>
            Your wallet has a story.
          </motion.h1>
          <motion.h2 {...fadeUp(0.2)} className="font-display font-bold grad" style={{ fontSize: 'clamp(38px,7vw,72px)', letterSpacing: '-2px', lineHeight: 1.1, marginTop: -16 }}>
            StellarMind tells it.
          </motion.h2>

          {/* Body */}
          <motion.p {...fadeUp(0.3)} style={{ color: 'var(--text-2)', fontSize: 18, maxWidth: 540 }}>
            Connect your Stellar testnet wallet and discover your financial personality, health score, and AI-powered insights — all running 100% in your browser.
          </motion.p>

          {/* CTA */}
          <motion.div {...fadeUp(0.4)} className="flex flex-col items-center gap-3">
            <WalletConnect onConnect={onConnect} isConnecting={isConnecting} error={connectError} />
            <p style={{ fontSize: 12, color: 'var(--text-3)' }}>
              Powered by Stellar + Claude AI • No backend required
            </p>
          </motion.div>

          {/* Freighter hint */}
          <motion.div {...fadeUp(0.5)} className="card px-4 py-2 flex items-center gap-2" style={{ fontSize: 13, color: 'var(--text-2)' }}>
            <span>📌</span>
            <span>Need Freighter? <a href="https://freighter.app" target="_blank" rel="noreferrer" style={{ color: 'var(--purple)' }}>Install the browser extension →</a></span>
          </motion.div>
        </div>
      </section>

      {/* Stats bar */}
      <section style={{ background: 'rgba(124,92,252,0.06)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        <div className="max-w-5xl mx-auto px-6 py-4 flex flex-wrap items-center justify-center gap-8">
          {STATS.map((s, i) => (
            <div key={i} className="flex items-center gap-3">
              <span className="w-1 h-4 rounded-full" style={{ background: 'var(--purple)' }} />
              <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-2)' }}>{s}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-6 py-24">
        <motion.div {...fadeUp(0)} className="text-center mb-14">
          <h2 className="font-display font-bold text-3xl text-white mb-3">Everything you need to understand your wallet</h2>
          <p style={{ color: 'var(--text-2)' }}>AI-powered insights tailored specifically to your Stellar transactions.</p>
        </motion.div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map((f, i) => (
            <motion.div key={i} {...fadeUp(i * 0.08)} className="card p-6 hover:card-purple transition-all">
              <div className="text-3xl mb-3">{f.icon}</div>
              <h3 className="font-display font-bold text-white text-lg mb-2">{f.title}</h3>
              <p style={{ fontSize: 14, color: 'var(--text-2)', lineHeight: 1.65 }}>{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-5xl mx-auto px-6 pb-24">
        <motion.div {...fadeUp(0)} className="text-center mb-14">
          <h2 className="font-display font-bold text-3xl text-white mb-3">How it works</h2>
          <p style={{ color: 'var(--text-2)' }}>From wallet connect to AI insights in under 30 seconds.</p>
        </motion.div>
        <div className="relative flex flex-col md:flex-row items-start gap-8">
          {/* Connector line */}
          <div className="hidden md:block absolute top-8 left-[16.66%] right-[16.66%] h-px" style={{ background: 'linear-gradient(90deg, var(--purple), var(--teal))' }} />
          {STEPS.map((s, i) => (
            <motion.div key={i} {...fadeUp(i * 0.1)} className="flex-1 flex flex-col items-center text-center">
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center font-display font-bold text-xl mb-5 relative z-10"
                style={{ background: 'linear-gradient(135deg, var(--purple), var(--teal))', color: 'white' }}
              >
                {s.n}
              </div>
              <h3 className="font-display font-bold text-white text-xl mb-2">{s.label}</h3>
              <p style={{ fontSize: 14, color: 'var(--text-2)' }}>{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid var(--border)', padding: '24px 24px', textAlign: 'center' }}>
        <p style={{ fontSize: 13, color: 'var(--text-3)' }}>
          StellarMind © 2026 •{' '}
          <a href="https://github.com" target="_blank" rel="noreferrer" style={{ color: 'var(--purple)' }}>GitHub</a>
          {' '}• Built for Stellar Monthly Builder Challenge
        </p>
      </footer>
    </div>
  );
}
