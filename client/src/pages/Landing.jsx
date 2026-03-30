import { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wallet, ShieldCheck, Cpu, Sparkles, HeartPulse, Dna, LayoutGrid, MessageSquare, Zap, FileText } from 'lucide-react';

const FEATURES = [
  { icon: HeartPulse, color: 'linear-gradient(135deg, #6366F1, #06B6D4)', title: 'Financial Health Score', desc: 'Real-time 0–100 score broken into Stability, Activity, Growth, and Risk — animated and always live.', tag: 'AI Calculated', tagClass: 'badge-indigo' },
  { icon: Dna, color: 'linear-gradient(135deg, #8B5CF6, #6366F1)', title: 'Wallet Personality Archetype', desc: 'Are you The Hodler, The Trader, or The Explorer? AI analyzes your behavior and assigns your type.', tag: '6 Archetypes', tagClass: 'badge-cyan' },
  { icon: LayoutGrid, color: 'linear-gradient(135deg, #06B6D4, #10B981)', title: 'Behavioral Heatmap', desc: 'A full-year calendar showing your transaction activity. Like GitHub contributions, but for money.', tag: '52 weeks', tagClass: 'badge-green' },
  { icon: MessageSquare, color: 'linear-gradient(135deg, #10B981, #06B6D4)', title: 'Ask Your Wallet', desc: 'Type any question about your transaction history and get an AI response in plain English. Instantly.', tag: 'AI Chat', tagClass: 'badge-indigo' },
  { icon: Zap, color: 'linear-gradient(135deg, #F59E0B, #EF4444)', title: 'Anomaly Pulse Alerts', desc: 'AI scans your history for unusual patterns — sudden spikes, new counterparties, dormancy breaks.', tag: 'Real-time', tagClass: 'badge-amber' },
  { icon: FileText, color: 'linear-gradient(135deg, #6366F1, #8B5CF6)', title: 'AI Monthly Reports', desc: 'One click generates a beautiful PDF report with your financial highlights and AI recommendations.', tag: 'PDF Export', tagClass: 'badge-cyan' },
];

const STEPS = [
  { 
    n: '01', 
    icon: Wallet, 
    title: 'Connect', 
    desc: 'Click connect. Authorize Freighter. Your public key is read — nothing else.',
    color: 'var(--indigo)'
  },
  { 
    n: '02', 
    icon: Cpu, 
    title: 'Analyze', 
    desc: 'Horizon API fetches your history. Claude AI processes it in seconds.',
    color: 'var(--cyan)'
  },
  { 
    n: '03', 
    icon: Sparkles, 
    title: 'Understand', 
    desc: 'Your full financial intelligence dashboard appears. Ready to explore.',
    color: 'var(--indigo)'
  },
];

const TRUST_ITEMS = [
  { icon: '🔗', text: 'Built on Stellar Horizon' },
  { icon: '🤖', text: 'Powered by Claude AI' },
  { icon: '🔒', text: 'Zero Backend' },
  { icon: '⚡', text: 'Open Source' },
];

const Stars = () => {
  const starList = useMemo(() => {
    return Array.from({ length: 80 }).map((_, i) => ({
      id: i,
      size: Math.random() * 2 + 1,
      x: Math.random() * 100,
      y: Math.random() * 100,
      duration: Math.random() * 3 + 2,
      delay: Math.random() * 4,
      color: Math.random() > 0.5 ? '#fff' : '#6366F1'
    }));
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none z-0">
      {starList.map(star => (
        <div
          key={star.id}
          className="absolute rounded-full"
          style={{
            width: star.size,
            height: star.size,
            left: `${star.x}%`,
            top: `${star.y}%`,
            background: star.color,
            animation: `twinkle ${star.duration}s ease-in-out infinite ${star.delay}s`,
            opacity: 0.4
          }}
        />
      ))}
    </div>
  );
};

const Rings = () => (
  <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
    <div className="relative w-[600px] h-[600px]">
      {/* Ring 1 */}
      <div 
        className="absolute inset-0 rounded-full border border-indigo/10"
        style={{ animation: 'orbit-cw 40s linear infinite' }} 
      >
        {/* Orbiting particles */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-indigo shadow-[0_0_10px_#6366F1]" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-cyan shadow-[0_0_10px_#06B6D4]" />
        <div className="absolute top-1/2 left-0 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_10px_#fff]" />
      </div>
      {/* Ring 2 */}
      <div 
        className="absolute top-[100px] bottom-[100px] left-[100px] right-[100px] rounded-full border border-dashed border-cyan/10"
        style={{ animation: 'orbit-ccw 25s linear infinite' }} 
      />
    </div>
  </div>
);

const heroVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2
    }
  }
};

const fadeUpVariant = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
};

export default function Landing({ onConnect, isConnecting, connectError }) {
  const [freighterInstalled, setFreighterInstalled] = useState(true);

  useEffect(() => {
    // Check if Freighter is available; this is a simplified check
    if (typeof window !== 'undefined' && !window.stellarTerm && !window.freighterApi) {
      // In reality we should use freighterApi.isConnected() or similar check once loaded
      // But for this UI spec we'll just mock it or keep it visible
    }
  }, []);

  return (
    <div className="relative bg-bg-base overflow-x-hidden min-h-screen">
      <Stars />
      <Rings />

      {/* Hero Section */}
      <section className="relative flex flex-col items-center justify-center text-center px-6 pt-32 pb-24 z-10 min-h-[90vh]">
        <motion.div
          variants={heroVariants}
          initial="hidden"
          animate="show"
          className="max-w-4xl"
        >
          {/* Badge */}
          <motion.div variants={fadeUpVariant} className="flex justify-center mb-6">
            <div className="badge badge-indigo !py-2 !px-4 !text-[12px] flex items-center gap-2">
              <span className="animate-pulse">✦</span> Built for Stellar Builder Challenge
            </div>
          </motion.div>

          {/* Headline */}
          <motion.h1 variants={fadeUpVariant} className="font-display font-extrabold text-[#F1F5F9] leading-[1.05] tracking-[-0.04em] mb-4 text-[clamp(48px,8vw,76px)]">
            Your wallet <br className="hidden sm:block" />
            <span className="text-grad">has a story.</span> <br className="hidden sm:block" />
            StellarMind tells it.
          </motion.h1>

          {/* Subtext */}
          <motion.p variants={fadeUpVariant} className="font-body text-t2 text-lg sm:text-xl max-w-[520px] mx-auto mb-10 leading-relaxed">
            Connect your Stellar wallet. Get AI-powered insights about your financial behavior, health score, and wallet personality — entirely in your browser.
          </motion.p>

          {/* CTA Group */}
          <motion.div variants={fadeUpVariant} className="flex flex-col items-center gap-6">
            <button
              onClick={onConnect}
              disabled={isConnecting}
              className="btn btn-primary !h-14 !w-[220px] !rounded-2xl !text-lg !gap-3 relative overflow-hidden group shadow-glow-indigo"
            >
              {isConnecting ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Wallet size={20} className="group-hover:scale-110 transition-transform" />
              )}
              {isConnecting ? 'Connecting...' : 'Connect Wallet →'}
            </button>

            <div className="flex gap-4 items-center flex-wrap justify-center">
              <span className="text-[12px] text-t3 flex items-center gap-1.5 font-medium uppercase tracking-wider">
                <ShieldCheck size={14} className="text-indigo" /> No private keys
              </span>
              <span className="hidden sm:block text-t4 opacity-30">•</span>
              <span className="text-[12px] text-t3 flex items-center gap-1.5 font-medium uppercase tracking-wider">
                <Cpu size={14} className="text-cyan" /> No backend
              </span>
              <span className="hidden sm:block text-t4 opacity-30">•</span>
              <span className="text-[12px] text-t3 flex items-center gap-1.5 font-medium uppercase tracking-wider">
                <Sparkles size={14} className="text-indigo" /> Testnet ready
              </span>
            </div>

            {connectError && (
              <div className="badge badge-red !py-2 !px-4 !text-[12px] animate-fadeUp">
                ⚠️ {connectError}
              </div>
            )}
            
            <a 
              href="https://freighter.app" 
              target="_blank" 
              rel="noreferrer" 
              className="badge badge-amber !py-2 !px-4 !text-[11px] group transition-all hover:scale-105"
            >
              ⚠️ Freighter extension required → Install at freighter.app
            </a>
          </motion.div>
        </motion.div>
      </section>

      {/* Live Preview Mockup */}
      <section className="px-6 py-12 relative z-10 overflow-hidden">
        <motion.div
           initial={{ opacity: 0, y: 40 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
           className="max-w-4xl mx-auto"
        >
          <div className="card relative p-1 rounded-[24px] group overflow-hidden shadow-2xl">
            {/* Rotating gradient border */}
            <div 
              className="absolute inset-0 opacity-40 group-hover:opacity-80 transition-opacity"
              style={{
                background: 'conic-gradient(from 0deg, var(--indigo), var(--cyan), var(--indigo))',
                animation: 'orbit-cw 10s linear infinite',
              }}
            />
            <div className="relative bg-bg-surface rounded-[23px] overflow-hidden">
              {/* Teaser content: simplified previews */}
              <div className="p-8 flex flex-col sm:flex-row gap-8 items-center bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.06),transparent)]">
                <div className="flex-1 w-full space-y-6">
                  <div className="h-8 w-48 bg-bg-elevated rounded-lg animate-pulse" />
                  <div className="h-24 w-full bg-bg-elevated rounded-xl animate-pulse" />
                  <div className="h-24 w-full bg-bg-elevated rounded-xl animate-pulse delay-75" />
                </div>
                <div className="w-full sm:w-[320px] aspect-square bg-bg-elevated rounded-3xl border border-b2 flex items-center justify-center p-12 overflow-hidden shadow-inner group">
                   <div className="w-full h-full rounded-full border-[10px] border-bg-surface flex items-center justify-center relative">
                      <div className="absolute inset-0 rounded-full border-[10px] border-indigo/20 border-t-indigo animate-spin" />
                      <span className="text-4xl font-display font-bold text-grad">74</span>
                   </div>
                </div>
              </div>
              
              {/* Glass Overlay */}
              <div className="absolute inset-0 bg-bg-void/40 backdrop-blur-[6px] flex flex-col items-center justify-center z-20">
                <div className="p-8 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-md shadow-2xl scale-110">
                  <p className="font-display font-bold text-xl text-white flex items-center gap-3">
                    Connect to unlock your dashboard <ArrowRight size={20} className="text-indigo animate-pulse" />
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Feature Section */}
      <section className="px-6 py-32 max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-20 max-w-2xl mx-auto">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-display font-bold text-4xl sm:text-5xl text-t1 mb-6"
          >
            Everything your wallet wants you to know
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-t2 text-lg font-body"
          >
            Powered by Stellar Horizon API + Claude AI — running entirely in your browser
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.5 }}
              className="card p-8 group cursor-default hover:translate-y-[-4px] transition-all hover:bg-bg-elevated/50"
            >
              <div 
                className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform"
                style={{ background: feature.color }}
              >
                <feature.icon className="text-white" size={28} />
              </div>
              <h3 className="font-display font-bold text-[17px] text-t1 mb-3">{feature.title}</h3>
              <p className="font-body text-t2 text-[14px] leading-relaxed mb-6">
                {feature.desc}
              </p>
              <div className={`badge ${feature.tagClass} self-start`}>
                {feature.tag}
              </div>
              {/* Shimmer sweep effect */}
              <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-[inherit]">
                 <div className="absolute top-0 -left-full bottom-0 w-2/3 bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-[-15deg] group-hover:left-[150%] transition-all duration-700" />
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="px-6 py-32 max-w-5xl mx-auto relative z-10">
        <div className="text-center mb-24">
           <h2 className="font-display font-bold text-4xl text-t1 m-0">Three steps to financial clarity</h2>
        </div>
        
        <div className="relative grid grid-cols-1 md:grid-cols-3 gap-12 sm:gap-20">
           {/* Connecting lines desktop */}
           <div className="hidden md:block absolute top-[68px] left-[15%] right-[15%] h-px border-t border-dashed border-t-b2 z-0">
              <div className="absolute top-[-2px] left-0 h-1 w-1 rounded-full bg-indigo shadow-[0_0_8px_var(--indigo)] animate-hor-move" />
           </div>

           {STEPS.map((step, i) => (
             <motion.div
               key={i}
               initial={{ opacity: 0, x: -20 }}
               whileInView={{ opacity: 1, x: 0 }}
               viewport={{ once: true }}
               transition={{ delay: i * 0.2 }}
               className="relative z-10 flex flex-col items-center text-center"
             >
                <div className="font-display font-bold text-[48px] text-t4 opacity-40 leading-none mb-6">
                   {step.n}
                </div>
                <div 
                  className="w-16 h-16 rounded-[24px] flex items-center justify-center mb-6 shadow-xl"
                  style={{ background: `linear-gradient(135deg, ${step.color}, transparent)`, borderColor: step.color, borderWidth: 1 }}
                >
                  <step.icon style={{ color: step.color }} size={24} />
                </div>
                <h3 className="font-display font-bold text-xl text-t1 mb-3">{step.title}</h3>
                <p className="font-body text-t2 text-sm leading-relaxed">{step.desc}</p>
             </motion.div>
           ))}
        </div>
      </section>

      {/* Trust Bar */}
      <section className="border-y border-b1 bg-bg-surface relative z-10 py-6">
         <div className="max-w-7xl mx-auto px-6 overflow-hidden">
            <div className="flex flex-wrap items-center justify-center gap-12 sm:gap-20">
               {TRUST_ITEMS.map((item, i) => (
                 <div key={i} className="flex items-center gap-2.5 whitespace-nowrap">
                    <span className="text-lg">{item.icon}</span>
                    <span className="text-[13px] font-medium text-t2 font-body">{item.text}</span>
                 </div>
               ))}
            </div>
         </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-12 border-t border-b1 relative z-10">
         <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-[10px]">
              <div className="w-[32px] h-[32px] rounded-full flex items-center justify-center font-display font-bold text-[13px] text-white"
                   style={{ background: 'linear-gradient(135deg, var(--indigo), var(--cyan))' }}>
                SM
              </div>
              <span className="font-display font-bold text-[17px] text-grad">StellarMind</span>
            </div>
            
            <p className="font-body text-sm text-t3 flex items-center gap-2">
              © 2026 StellarMind. Built for Stellar Builder Challenge.
            </p>

            <div className="flex items-center gap-6">
               <a href="https://github.com" target="_blank" rel="noreferrer" className="text-t3 hover:text-t1 transition-colors text-sm font-medium">GitHub</a>
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
        .animate-hor-move {
           animation: hor-move 3s linear infinite;
        }
      `}</style>
    </div>
  );
}

function ArrowRight(props) {
  return (
    <svg 
      {...props}
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
    >
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}
