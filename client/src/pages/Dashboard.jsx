import { useEffect, useState, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Copy, RefreshCw, LogOut, FileText, Check, LayoutDashboard,
  Sparkles, Activity, Clock, ExternalLink
} from 'lucide-react';
import toast from 'react-hot-toast';

import { useHorizon } from '../hooks/useHorizon';
import { useAI } from '../hooks/useAI';
import LoadingOverlay from '../components/LoadingOverlay';
import HealthScoreRing from '../components/HealthScoreRing';
import PersonalityCard from '../components/PersonalityCard';
import HeatmapCalendar from '../components/HeatmapCalendar';
import AskWallet from '../components/AskWallet';
import AnomalyAlert from '../components/AnomalyAlert';
import MoodMeter from '../components/MoodMeter';
import NetworkComparison from '../components/NetworkComparison';
import GoalTracker from '../components/GoalTracker';
import AssetBreakdown from '../components/AssetBreakdown';
import TransactionTimeline from '../components/TransactionTimeline';
import { truncateAddress, formatRelative } from '../utils/formatters';

export default function Dashboard({ walletAddress, onDisconnect }) {
  const navigate = useNavigate();
  const { walletData, fetchWalletData, error: horizonError } = useHorizon();
  const { analysis, analyzing, runAnalysis, sendMessage, chatHistory, chatLoading, clearChat } = useAI();

  const [loadStep, setLoadStep] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [copied, setCopied] = useState(false);
  const hasLoaded = useRef(false);

  const load = async (walletAddr) => {
    hasLoaded.current = true;
    setLoaded(false);
    setLoadStep(0);
    const data = await fetchWalletData(walletAddr);
    if (!data) { setLoaded(true); return; }
    setLoadStep(1);
    await runAnalysis(data);
    setLoadStep(2);
    await new Promise(r => setTimeout(r, 800));
    setLoaded(true);
  };

  useEffect(() => {
    if (walletAddress && !hasLoaded.current) load(walletAddress);
  }, [walletAddress]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(walletAddress);
      setCopied(true);
      toast.success('Address copied to clipboard');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Failed to copy');
    }
  };

  const handleReanalyze = () => { hasLoaded.current = false; load(walletAddress); };
  const handleDisconnect = () => { onDisconnect(); navigate('/'); };

  const dashboardItems = useMemo(() => [
    {
      id: 'health',
      component: <HealthScoreRing score={analysis?.healthScore} breakdown={analysis?.healthBreakdown} />,
      className: 'md:col-start-1 md:col-end-4',
    },
    {
      id: 'insight',
      component: (
        <div className="glass-panel glass-glow-insight h-full p-8 flex flex-col justify-center">
          {/* Subtle radial gradient bg */}
          <div className="absolute inset-0 pointer-events-none rounded-[inherit]"
            style={{ background: 'radial-gradient(circle at 30% 30%, rgba(99,102,241,0.12), transparent 60%)' }} />
          <div className="relative z-10">
            <div className="badge badge-indigo mb-5 !py-1.5 !px-3 font-bold uppercase tracking-[0.1em] text-[10px]">✦ Key Insight</div>
            <h2 className="font-display font-bold text-t1 text-[22px] leading-[1.35] mb-5">
              {analysis?.topInsight || 'Analyzing your recent activity to find patterns…'}
            </h2>
            <div className="flex gap-8 pt-5" style={{ borderTop: '1px solid var(--glass-border)' }}>
              <div className="flex flex-col">
                <span className="text-[10px] text-t3 uppercase font-bold tracking-widest mb-1">TX Count</span>
                <span className="font-mono text-[18px] text-t1 font-bold">{walletData?.transactions?.length || 0}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] text-t3 uppercase font-bold tracking-widest mb-1">Active Days</span>
                <span className="font-mono text-[18px] font-bold" style={{ color: 'var(--cyan)' }}>
                  {Object.keys(walletData?.activityByDate || {}).length}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] text-t3 uppercase font-bold tracking-widest mb-1">Assets</span>
                <span className="font-mono text-[18px] font-bold" style={{ color: 'var(--indigo)' }}>
                  {walletData?.assets?.length || 0}
                </span>
              </div>
            </div>
          </div>
        </div>
      ),
      className: 'md:col-start-4 md:col-end-9',
    },
    {
      id: 'mood',
      component: <MoodMeter moodScore={analysis?.moodScore} moodLabel={analysis?.moodLabel} />,
      className: 'md:col-start-9 md:col-end-13',
    },
    {
      id: 'personality',
      component: <PersonalityCard personality={analysis?.personality} monthlyTrend={analysis?.monthlyTrend} />,
      className: 'md:col-start-1 md:col-end-4',
    },
    {
      id: 'heatmap',
      component: <HeatmapCalendar activityByDate={walletData?.activityByDate} />,
      className: 'md:col-start-4 md:col-end-13',
    },
    {
      id: 'ask',
      component: (
        <AskWallet
          chatHistory={chatHistory}
          onSend={(q) => sendMessage(q, walletData)}
          chatLoading={chatLoading}
          onClear={clearChat}
          walletAddress={walletAddress}
        />
      ),
      className: 'md:col-start-1 md:col-end-6',
    },
    {
      id: 'anomalies',
      component: <AnomalyAlert anomalies={analysis?.anomalies} />,
      className: 'md:col-start-6 md:col-end-9',
    },
    {
      id: 'assets',
      component: <AssetBreakdown assetSummary={walletData?.assets} />,
      className: 'md:col-start-9 md:col-end-13',
    },
    {
      id: 'timeline',
      component: (
        <TransactionTimeline
          transactions={walletData?.transactions}
          operations={walletData?.operations}
          walletAddress={walletAddress}
        />
      ),
      className: 'md:col-start-1 md:col-end-8',
    },
    {
      id: 'goals',
      component: <GoalTracker walletAddress={walletAddress} />,
      className: 'md:col-start-8 md:col-end-13',
    },
    {
      id: 'network',
      component: <NetworkComparison networkComparison={analysis?.networkComparison} />,
      className: 'md:col-start-1 md:col-end-7',
    },
    {
      id: 'testnet_callout',
      component: (
        // Standout gradient callout — one per view
        <div
          className="glass-callout h-full p-8 flex items-center justify-between cursor-pointer group"
          onClick={() => navigate('/report')}
          role="button"
          tabIndex={0}
          onKeyDown={e => e.key === 'Enter' && navigate('/report')}
        >
          {/* Top-left: content */}
          <div className="flex items-center gap-5 relative z-10">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-200"
              style={{
                background: 'rgba(255,255,255,0.12)',
                border: '1px solid rgba(255,255,255,0.2)',
                backdropFilter: 'blur(8px)',
              }}
            >
              <FileText size={28} className="text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-display font-bold text-[19px] text-white m-0">Monthly Report Ready</h3>
                <Sparkles size={15} className="text-cyan animate-pulse" />
              </div>
              <p className="font-body text-[13px] text-[rgba(255,255,255,0.65)] m-0">
                AI has summarized your on-chain performance this month.
              </p>
            </div>
          </div>
          {/* CTA arrow */}
          <button className="btn btn-secondary !py-2.5 !px-5 !text-[13px] hidden md:flex items-center gap-2 group-hover:translate-x-1 transition-transform">
            View Report <ExternalLink size={13} />
          </button>
        </div>
      ),
      className: 'md:col-start-7 md:col-end-13',
    },
  ], [analysis, walletData, chatHistory, chatLoading, walletAddress, navigate]);

  if (!loaded) return <LoadingOverlay currentStep={loadStep} />;

  return (
    <div className="min-h-screen pb-20 overflow-x-hidden" style={{ paddingTop: 80, position: 'relative', zIndex: 1 }}>

      {/* Top Header */}
      <div className="max-w-[1400px] mx-auto px-6 mb-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-3 mb-1">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{ background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.3)' }}
              >
                <LayoutDashboard size={18} style={{ color: 'var(--indigo)' }} />
              </div>
              <h1 className="font-display font-bold text-[28px] text-t1 m-0 tracking-tight">
                Intelligence Dashboard
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-t3 text-[12px] font-mono">
                <Clock size={13} />
                Last updated {walletData ? formatRelative(walletData.fetchedAt) : 'just now'}
              </div>
              <div className="flex items-center gap-2 text-[12px] font-medium uppercase tracking-wider"
                style={{ color: 'var(--green)' }}>
                <Activity size={13} /> Live
              </div>
            </div>
          </div>

          {/* Action chips */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Wallet chip */}
            <button
              id="copy-address-btn"
              onClick={handleCopy}
              className="btn btn-secondary !h-10 !px-4 rounded-full flex items-center gap-2.5 cursor-pointer group transition-all duration-200"
            >
              <span className="w-2 h-2 rounded-full flex-shrink-0"
                style={{ background: 'var(--cyan)', boxShadow: '0 0 8px var(--cyan)' }} />
              <span className="font-mono text-[13px] text-t2">{truncateAddress(walletAddress, 6)}</span>
              {copied
                ? <Check size={13} style={{ color: 'var(--green)' }} />
                : <Copy size={13} className="text-t3 group-hover:text-t1 transition-colors" />
              }
            </button>

            <div className="h-8 w-px bg-[var(--b2)]" />


            <button
              id="reanalyze-btn"
              onClick={handleReanalyze}
              className="btn btn-primary !h-10 !px-4 !text-sm !gap-2"
            >
              <RefreshCw size={13} className={analyzing ? 'animate-spin' : ''} /> Re-analyze
            </button>

            <button
              id="report-nav-btn"
              onClick={() => navigate('/report')}
              className="btn btn-secondary !h-10 !px-4 !text-sm !gap-2"
            >
              <FileText size={13} /> Report
            </button>

            <button
              id="dashboard-disconnect-btn"
              onClick={handleDisconnect}
              className="btn btn-muted !h-10 !px-4 !text-sm !gap-2"
            >
              <LogOut size={13} /> Disconnect
            </button>
          </div>
        </div>

        {/* Error banner */}
        {horizonError && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-5 p-4 rounded-2xl flex items-center gap-3 text-[14px]"
            style={{
              background: 'rgba(239,68,68,0.08)',
              border: '1px solid rgba(239,68,68,0.25)',
              color: 'var(--red)',
            }}
          >
            <span className="text-[18px]">⚠️</span>
            {horizonError}
          </motion.div>
        )}
      </div>

      {/* Main Grid */}
      <div className="max-w-[1400px] mx-auto px-6">
        <motion.div
          initial="hidden"
          animate="show"
          variants={{ show: { transition: { staggerChildren: 0.06 } } }}
          className="grid grid-cols-1 md:grid-cols-12 auto-rows-auto gap-5"
        >
          {dashboardItems.map((item) => (
            <motion.div
              key={item.id}
              variants={{
                hidden: { opacity: 0, y: 20 },
                show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] } },
              }}
              className={`${item.className} h-full`}
            >
              {item.component}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
