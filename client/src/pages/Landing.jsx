import { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Wallet, ShieldCheck, Cpu, Sparkles, HeartPulse, Dna,
  LayoutGrid, MessageSquare, Zap, FileText, ExternalLink, ArrowRight
} from 'lucide-react';
import BrandLogo from '../components/BrandLogo';

const FEATURES = [
  {
    icon: HeartPulse,
    gradient: 'linear-gradient(135deg, #6366F1, #06B6D4)',
    title: 'Financial Health Score',
    desc: 'Real-time 0–100 score broken into Stability, Activity, Growth, and Risk — animated and always live.',
    tag: 'AI Calculated',
    tagClass: 'badge-indigo',
  },
  {
    icon: Dna,
    gradient: 'linear-gradient(135deg, #8B5CF6, #6366F1)',
    title: 'Wallet Personality',
    desc: 'Are you The Hodler, The Trader, or The Explorer? AI analyzes your on-chain behavior and assigns your archetype.',
    tag: '6 Archetypes',
    tagClass: 'badge-violet',
  },
  {
    icon: LayoutGrid,
    gradient: 'linear-gradient(135deg, #06B6D4, #10B981)',
    title: 'Behavioral Heatmap',
    desc: 'A full-year calendar of your transaction activity — like GitHub contributions, but for your money.',
    tag: '52 weeks',
    tagClass: 'badge-cyan',
  },
  {
    icon: MessageSquare,
    gradient: 'linear-gradient(135deg, #10B981, #06B6D4)',
    title: 'Ask Your Wallet',
    desc: 'Type any question about your transaction history and get an AI response in plain English. Instantly.',
    tag: 'AI Chat',
    tagClass: 'badge-green',
  },
  {
    icon: Zap,
    gradient: 'linear-gradient(135deg, #F59E0B, #EF4444)',
    title: 'Anomaly Pulse Alerts',
    desc: 'AI scans your history for unusual patterns — sudden spikes, new counterparties, dormancy breaks.',
    tag: 'Real-time',
    tagClass: 'badge-amber',
  },
  {
    icon: FileText,
    gradient: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
    title: 'AI Monthly Reports',
    desc: 'One click generates a beautiful PDF report with your financial highlights and AI recommendations.',
    tag: 'PDF Export',
    tagClass: 'badge-indigo',
  },
];

const STEPS = [
  { n: '01', icon: Wallet, title: 'Connect', desc: 'Click connect. Authorize Freighter. Your public key is read — nothing else.', color: '#7C5CFC' },
  { n: '02', icon: Cpu, title: 'Analyze', desc: 'Horizon API fetches your full history. AI processes it in seconds.', color: '#06B6D4' },
  { n: '03', icon: Sparkles, title: 'Understand', desc: 'Your complete financial intelligence dashboard appears — ready to explore.', color: '#8B5CF6' },
];

const TRUST_ITEMS = [
  { icon: '🔗', text: 'Built on Stellar Horizon' },
  { icon: '🤖', text: 'Advanced AI Analytics' },
  { icon: '🔒', text: 'Zero Backend' },
  { icon: '⚡', text: 'Open Source' },
];

const Stars = () => {
  const starList = useMemo(() => Array.from({ length: 80 }).map((_, i) => ({
    id: i,
    size: Math.random() * 2 + 1,
    x: Math.random() * 100,
    y: Math.random() * 100,
    duration: Math.random() * 3 + 2,
    delay: Math.random() * 4,
    color: Math.random() > 0.5 ? '#fff' : '#818CF8',
  })), []);

  return (
    <div className="absolute inset-0 pointer-events-none z-0">
      {starList.map(star => (
        <div
          key={star.id}
          className="absolute rounded-full"
          style={{
            width: star.size, height: star.size,
            left: `${star.x}%`, top: `${star.y}%`,
            background: star.color,
            animation: `twinkle ${star.duration}s ease-in-out infinite ${star.delay}s`,
            opacity: 0.3,
          }}
        />
      ))}
    </div>
  );
};

const Rings = () => (
  <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
    <div className="relative w-[600px] h-[600px]">
      <div
        className="absolute inset-0 rounded-full"
        style={{
          border: '1px solid rgba(99,102,241,0.12)',
          animation: 'orbit-cw 40s linear infinite',
        }}
      >
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full" style={{ background: '#6366F1', boxShadow: '0 0 10px #6366F1' }} />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full" style={{ background: '#06B6D4', boxShadow: '0 0 10px #06B6D4' }} />
        <div className="absolute top-1/2 left-0 -translate-y-1/2 w-1.5 h-1.5 rounded-full" style={{ background: 'white', boxShadow: '0 0 10px white' }} />
      </div>
      <div
        className="absolute top-[100px] bottom-[100px] left-[100px] right-[100px] rounded-full"
        style={{
          border: '1px dashed rgba(6,182,212,0.1)',
          animation: 'orbit-ccw 25s linear infinite',
        }}
      />
    </div>
  </div>
);

const heroVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.2 } },
};

const fadeUpVariant = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
};

export default function Landing({ onConnect, isConnecting, connectError }) {
  return (
    <div className="relative overflow-x-hidden min-h-screen" style={{ position: 'relative', zIndex: 1 }}>
      <Stars />
      <Rings />

      {/* ── HERO ─────────────────────────────────── */}
      <section className="relative flex flex-col items-center justify-center text-center px-6 pt-32 pb-24 z-10 min-h-[92vh]">
        <motion.div variants={heroVariants} initial="hidden" animate="show" className="max-w-4xl">

          {/* Hackathon badge removed */}

          {/* H1 */}
          <motion.h1
            variants={fadeUpVariant}
            className="font-display font-extrabold text-[var(--t1)] leading-[1.05] tracking-[-0.04em] mb-4"
            style={{ fontSize: 'clamp(48px, 8vw, 78px)' }}
          >
            Your wallet <br className="hidden sm:block" />
            <span className="text-grad">has a story.</span>{' '}
            <br className="hidden sm:block" />
            StellarMind tells it.
          </motion.h1>

          {/* Subtext */}
          <motion.p
            variants={fadeUpVariant}
            className="font-body text-t2 text-lg sm:text-xl max-w-[540px] mx-auto mb-10 leading-relaxed"
          >
            Connect your Stellar wallet. Get AI-powered insights about your financial behavior,
            health score, and wallet personality — entirely in your browser.
          </motion.p>

          {/* CTA group */}
          <motion.div variants={fadeUpVariant} className="flex flex-col items-center gap-6">
            <button
              id="connect-wallet-btn"
              onClick={onConnect}
              disabled={isConnecting}
              className="btn btn-primary !h-14 !px-10 !text-[16px] !gap-3 shadow-glow-indigo disabled:opacity-60"
            >
              {isConnecting
                ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                : <Wallet size={20} className="transition-transform group-hover:scale-110" />
              }
              {isConnecting ? 'Connecting...' : 'Connect Wallet'}
              {!isConnecting && <ArrowRight size={18} />}
            </button>

            {/* Trust trio */}
            <div className="flex gap-5 items-center flex-wrap justify-center">
              <span className="text-[12px] text-t3 flex items-center gap-1.5 font-medium uppercase tracking-wider">
                <ShieldCheck size={13} className="text-indigo" /> No private keys
              </span>
              <span className="hidden sm:block text-t4 opacity-30">•</span>
              <span className="text-[12px] text-t3 flex items-center gap-1.5 font-medium uppercase tracking-wider">
                <Cpu size={13} className="text-cyan" /> No backend
              </span>
              <span className="hidden sm:block text-t4 opacity-30">•</span>
              <span className="text-[12px] text-t3 flex items-center gap-1.5 font-medium uppercase tracking-wider">
                <Sparkles size={13} className="text-indigo" /> Testnet ready
              </span>
            </div>

            {connectError && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="badge badge-red !py-2 !px-4 !text-[12px]"
              >
                ⚠️ {connectError}
              </motion.div>
            )}

            <a
              href="https://freighter.app"
              target="_blank"
              rel="noreferrer"
              className="badge badge-amber !py-2 !px-4 !text-[11px] flex items-center gap-1.5 hover:opacity-80 transition-opacity"
            >
              ⚠️ Requires Freighter extension
              <ExternalLink size={11} />
            </a>
          </motion.div>
        </motion.div>
      </section>

      {/* ── LIVE PREVIEW MOCKUP ───────────────────── */}
      <section className="px-6 py-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-4xl mx-auto"
        >
          <div className="glass-panel relative p-1 rounded-[24px] group overflow-hidden"
            style={{ boxShadow: '0 0 80px rgba(99,102,241,0.12), 0 20px 60px rgba(0,0,0,0.5)' }}>
            {/* Rotating conic border */}
            <div
              className="absolute inset-0 opacity-30 group-hover:opacity-60 transition-opacity rounded-[24px]"
              style={{ background: 'conic-gradient(from 0deg, #7C5CFC, #06B6D4, #EC4899, #7C5CFC)', animation: 'orbit-cw 12s linear infinite' }}
            />
            <div className="relative rounded-[23px] overflow-hidden" style={{ background: 'var(--bg-surface)', border: '1px solid var(--glass-border)', backdropFilter: 'blur(var(--glass-blur))' }}>
              <div className="p-8 flex flex-col sm:flex-row gap-8 items-center">
                <div className="flex-1 w-full space-y-4">
                  <div className="skeleton h-8 w-48 rounded-xl" />
                  <div className="skeleton h-20 w-full rounded-xl" />
                  <div className="skeleton h-20 w-full rounded-xl" style={{ animationDelay: '0.3s' }} />
                </div>
                <div className="w-full sm:w-[280px] aspect-square rounded-3xl flex items-center justify-center p-10"
                  style={{ background: 'rgba(15,23,42,0.02)', border: '1px solid var(--glass-border)' }}>
                  <div className="w-full h-full rounded-full flex items-center justify-center relative"
                    style={{ border: '10px solid rgba(15,23,42,0.03)' }}>
                    <div className="absolute inset-0 rounded-full" style={{ border: '10px solid rgba(99,102,241,0)', borderTopColor: 'var(--indigo)', animation: 'orbit-cw 2s linear infinite' }} />
                    <span className="text-4xl font-display font-bold text-grad">74</span>
                  </div>
                </div>
              </div>

              {/* Frosted overlay CTA */}
              <div className="absolute inset-0 flex flex-col items-center justify-center z-20"
                style={{ background: 'rgba(15,23,42,0.15)', backdropFilter: 'blur(8px)' }}>
                <div className="glass-panel p-8 rounded-3xl scale-105"
                  style={{ border: '1px solid var(--glass-border)', boxShadow: 'var(--shadow-xl)' }}>
                  <p className="font-display font-bold text-xl text-t1 flex items-center gap-3">
                    Connect to unlock your dashboard
                    <ArrowRight size={20} className="text-indigo animate-pulse" />
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ── TESTNET CALLOUT CARD ─────────────────── */}
      <section className="px-6 py-12 max-w-4xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="glass-callout p-8 flex flex-col sm:flex-row items-center justify-between gap-6"
        >
          <div className="flex flex-col gap-2">
            <div className="badge badge-violet !mb-3 self-start">🧪 Testnet Mode</div>
            <h3 className="font-display font-bold text-xl text-white leading-snug">
              You're exploring on Stellar Testnet.
            </h3>
            <p className="font-body text-sm text-[rgba(255,255,255,0.65)] leading-relaxed max-w-md">
              All data is live from the Stellar Horizon Testnet API. Fund a testnet wallet via Stellar Friendbot to see your real data.
            </p>
          </div>
          <a
            href="https://laboratory.stellar.org/#account-creator?network=test"
            target="_blank"
            rel="noreferrer"
            className="btn btn-secondary !whitespace-nowrap flex-shrink-0 !gap-2"
          >
            Get Testnet XLM <ExternalLink size={14} />
          </a>
        </motion.div>
      </section>

      {/* ── FEATURES ─────────────────────────────── */}
      <section className="px-6 py-24 max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-display font-bold text-4xl sm:text-5xl text-t1 mb-5"
          >
            Everything your wallet wants you to know
          </motion.h2>

        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07, duration: 0.5 }}
              className="glass-panel p-8 group cursor-default"
            >
              {/* Icon */}
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-200"
                style={{ background: feature.gradient }}
              >
                <feature.icon className="text-white" size={26} />
              </div>
              <h3 className="font-display font-bold text-[17px] text-t1 mb-3">{feature.title}</h3>
              <p className="font-body text-t2 text-[14px] leading-relaxed mb-5">{feature.desc}</p>
              <div className={`badge ${feature.tagClass} self-start`}>{feature.tag}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────── */}
      <section className="px-6 py-24 max-w-5xl mx-auto relative z-10">
        <div className="text-center mb-20">
          <h2 className="font-display font-bold text-4xl text-t1">Three steps to financial clarity</h2>
        </div>
        <div className="relative grid grid-cols-1 md:grid-cols-3 gap-12 sm:gap-16">
          {/* Connector line */}
          <div className="hidden md:block absolute top-[68px] left-[16%] right-[16%] h-px"
            style={{ borderTop: '1px dashed rgba(255,255,255,0.12)' }}>
            <div className="absolute top-[-2px] h-1 w-1 rounded-full"
              style={{ background: 'var(--indigo)', boxShadow: '0 0 8px var(--indigo)', animation: 'hor-move 3s linear infinite' }} />
          </div>

          {STEPS.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="relative z-10 flex flex-col items-center text-center"
            >
              <div className="font-display font-bold text-[48px] text-t4 opacity-30 leading-none mb-5">{step.n}</div>
              <div
                className="w-16 h-16 rounded-[22px] flex items-center justify-center mb-5 shadow-xl"
                style={{
                  background: `linear-gradient(135deg, ${step.color}30, transparent)`,
                  border: `1px solid ${step.color}40`,
                  backdropFilter: 'blur(12px)',
                }}
              >
                <step.icon style={{ color: step.color }} size={24} />
              </div>
              <h3 className="font-display font-bold text-xl text-t1 mb-3">{step.title}</h3>
              <p className="font-body text-t2 text-sm leading-relaxed">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── TRUST BAR ────────────────────────────── */}
      <section className="relative z-10 py-6"
        style={{ background: 'var(--glass-bg)', borderTop: '1px solid var(--glass-border)', borderBottom: '1px solid var(--glass-border)', backdropFilter: 'blur(20px)' }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-wrap items-center justify-center gap-10 sm:gap-20">
            {TRUST_ITEMS.map((item, i) => (
              <div key={i} className="flex items-center gap-2.5 whitespace-nowrap">
                <span className="text-lg">{item.icon}</span>
                <span className="text-[13px] font-medium text-t2 font-body">{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────── */}
      <footer className="px-6 py-12 relative z-10" style={{ borderTop: '1px solid var(--b1)' }}>
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-8">
          <BrandLogo size="sm" showName />
          <p className="font-body text-sm text-t3">
            © 2026 StellarMind. Built for Stellar Builder Challenge.
          </p>
          <div className="flex items-center gap-6">
            <a href="https://github.com/xaden1/stellarmind" target="_blank" rel="noreferrer"
              className="text-t3 hover:text-t1 transition-colors text-sm font-medium">GitHub</a>
            <a href="#" className="text-t3 hover:text-t1 transition-colors text-sm font-medium">Privacy</a>
          </div>
        </div>
      </footer>

      <style>{`
        @keyframes hor-move {
          0% { left: 0; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { left: 100%; opacity: 0; }
        }
      `}</style>
    </div>
  );
}
