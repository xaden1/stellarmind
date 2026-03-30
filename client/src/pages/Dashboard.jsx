import { useEffect, useState, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Copy, RefreshCw, LogOut, FileText, Check, LayoutDashboard, Sparkles, Activity, Clock } from 'lucide-react';
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
    if (!data) {
      setLoaded(true);
      return;
    }

    setLoadStep(1);
    await runAnalysis(data);

    setLoadStep(2);
    // Visual polish delay
    await new Promise(r => setTimeout(r, 800));
    setLoaded(true);
  };

  useEffect(() => {
    if (walletAddress && !hasLoaded.current) {
      load(walletAddress);
    }
  }, [walletAddress]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(walletAddress);
      setCopied(true);
      toast.success('Address copied to clipboard');
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error('Failed to copy');
    }
  };

  const handleReanalyze = () => {
    hasLoaded.current = false;
    load(walletAddress);
  };

  const handleDisconnect = () => {
    onDisconnect();
    navigate('/');
  };

  const dashboardItems = useMemo(() => [
    { id: 'health', component: <HealthScoreRing score={analysis?.healthScore} breakdown={analysis?.healthBreakdown} />, className: 'md:col-start-1 md:col-end-4' },
    { 
      id: 'insight', 
      component: (
        <div className="card h-full p-8 flex flex-col justify-center relative overflow-hidden group">
          {/* Radial gradient background */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(99,102,241,0.15),transparent)] pointer-events-none" />
          <div className="relative z-10">
            <div className="badge badge-indigo mb-6 !py-1.5 !px-3 font-bold uppercase tracking-[0.1em] text-[10px]">✦ Key Insight</div>
            <h2 className="font-display font-bold text-t1 text-[24px] leading-[1.3] mb-6">
               {analysis?.topInsight || 'Analyzing your recent activity to find patterns...'}
            </h2>
            <div className="flex gap-8 border-t border-[var(--b2)] pt-6">
               <div className="flex flex-col">
                  <span className="text-[10px] text-t3 uppercase font-bold tracking-widest mb-1">TX/Month</span>
                  <span className="font-mono text-[18px] text-t1 font-bold">{walletData?.transactions?.length || 0}</span>
               </div>
               <div className="flex flex-col">
                  <span className="text-[10px] text-t3 uppercase font-bold tracking-widest mb-1">Active Days</span>
                  <span className="font-mono text-[18px] text-cyan font-bold">{Object.keys(walletData?.activityByDate || {}).length}</span>
               </div>
               <div className="flex flex-col">
                  <span className="text-[10px] text-t3 uppercase font-bold tracking-widest mb-1">Assets</span>
                  <span className="font-mono text-[18px] text-indigo font-bold">{walletData?.assets?.length || 0}</span>
               </div>
            </div>
          </div>
        </div>
      ), 
      className: 'md:col-start-4 md:col-end-9' 
    },
    { id: 'mood', component: <MoodMeter moodScore={analysis?.moodScore} moodLabel={analysis?.moodLabel} />, className: 'md:col-start-9 md:col-end-13' },
    { id: 'personality', component: <PersonalityCard personality={analysis?.personality} monthlyTrend={analysis?.monthlyTrend} />, className: 'md:col-start-1 md:col-end-4' },
    { id: 'heatmap', component: <HeatmapCalendar activityByDate={walletData?.activityByDate} />, className: 'md:col-start-4 md:col-end-13' },
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
      className: 'md:col-start-1 md:col-end-6' 
    },
    { id: 'anomalies', component: <AnomalyAlert anomalies={analysis?.anomalies} />, className: 'md:col-start-6 md:col-end-9' },
    { id: 'assets', component: <AssetBreakdown assetSummary={walletData?.assets} />, className: 'md:col-start-9 md:col-end-13' },
    { id: 'timeline', component: <TransactionTimeline transactions={walletData?.transactions} operations={walletData?.operations} walletAddress={walletAddress} />, className: 'md:col-start-1 md:col-end-8' },
    { id: 'goals', component: <GoalTracker walletAddress={walletAddress} />, className: 'md:col-start-8 md:col-end-13' },
    { id: 'network', component: <NetworkComparison networkComparison={analysis?.networkComparison} />, className: 'md:col-start-1 md:col-end-7' },
    { 
      id: 'report_banner', 
      component: (
        <div className="card h-full p-8 flex items-center justify-between group cursor-pointer relative overflow-hidden" onClick={() => navigate('/report')}>
          <div className="absolute inset-0 bg-grad-cyan opacity-5 group-hover:opacity-10 transition-opacity" />
          {/* Animated border pulse */}
          <div className="absolute inset-0 border border-cyan/20 group-hover:border-cyan/50 rounded-[inherit] transition-colors" />
          
          <div className="flex items-center gap-6 relative z-10">
             <div className="w-16 h-16 rounded-2xl bg-cyan-dim flex items-center justify-center text-cyan shadow-glow-cyan group-hover:scale-110 transition-transform">
                <FileText size={32} />
             </div>
             <div>
                <div className="flex items-center gap-2 mb-1">
                   <h3 className="font-display font-bold text-[20px] text-t1 m-0">Monthly Report Ready</h3>
                   <Sparkles size={16} className="text-cyan animate-pulse" />
                </div>
                <p className="font-body text-[14px] text-t3 m-0">AI has summarized your performance for this month.</p>
             </div>
          </div>
          <button className="btn btn-ghost !text-cyan group-hover:translate-x-2 transition-transform hidden md:flex items-center gap-2">
             View Report <RefreshCw size={14} className="rotate-90" />
          </button>
        </div>
      ), 
      className: 'md:col-start-7 md:col-end-13' 
    },
  ], [analysis, walletData, chatHistory, chatLoading, walletAddress, navigate]);

  if (!loaded) {
    return <LoadingOverlay currentStep={loadStep} />;
  }

  return (
    <div className="min-h-screen bg-bg-base pb-20 overflow-x-hidden" style={{ paddingTop: 80 }}>
      
      {/* Top Header Section */}
      <div className="max-w-[1400px] mx-auto px-6 mb-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-3 mb-1">
               <div className="w-8 h-8 rounded-lg bg-indigo-dim flex items-center justify-center text-indigo">
                  <LayoutDashboard size={18} />
               </div>
               <h1 className="font-display font-bold text-[28px] text-t1 m-0 tracking-tight">Intelligence Dashboard</h1>
            </div>
            <div className="flex items-center gap-4">
               <div className="flex items-center gap-2 text-t3 text-[12px] font-mono">
                  <Clock size={14} />
                  Last updated {walletData ? formatRelative(walletData.fetchedAt) : 'just now'}
               </div>
               <div className="flex items-center gap-2 text-green text-[12px] font-medium uppercase tracking-wider">
                  <Activity size={14} /> Live
               </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
             {/* Wallet Chip */}
             <div 
               onClick={handleCopy}
               className="h-10 px-4 rounded-xl bg-bg-surface border border-b2 flex items-center gap-3 cursor-pointer group transition-all hover:border-indigo hover:bg-bg-elevated"
             >
                <div className="w-2 h-2 rounded-full bg-cyan shadow-[0_0_8px_var(--cyan)]" />
                <span className="font-mono text-[13px] text-t2 font-medium tracking-wide">
                   {truncateAddress(walletAddress, 6)}
                </span>
                {copied ? <Check size={14} className="text-green" /> : <Copy size={14} className="text-t3 group-hover:text-t1 transition-colors" />}
             </div>

             <div className="h-10 w-px bg-b2 mx-1" />

             <button onClick={handleReanalyze} className="btn btn-ghost !h-10 !px-4 !text-sm !gap-2">
                <RefreshCw size={14} className={analyzing ? 'animate-spin' : ''} /> Re-analyze
             </button>
             
             <button onClick={() => navigate('/report')} className="btn btn-ghost !h-10 !px-4 !text-sm !gap-2">
                <FileText size={14} /> Report
             </button>

             <button onClick={handleDisconnect} className="btn btn-ghost !h-10 !px-4 !text-sm !gap-2 !text-red/70 hover:!text-red hover:!bg-red/5">
                <LogOut size={14} /> Disconnect
             </button>
          </div>
        </div>

        {/* Global Error Banner */}
        {horizonError && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="mt-6 p-4 rounded-xl bg-red-dim border border-red/20 text-red text-[14px] flex items-center gap-3"
          >
             <span className="text-[18px]">⚠️</span>
             {horizonError}
          </motion.div>
        )}
      </div>

      {/* Main Grid Container */}
      <div className="max-w-[1400px] mx-auto px-6">
        <motion.div 
           initial="hidden"
           animate="show"
           variants={{
             show: {
               transition: {
                 staggerChildren: 0.06
               }
             }
           }}
           className="grid grid-cols-1 md:grid-cols-12 auto-rows-auto gap-6"
        >
          {dashboardItems.map((item, idx) => (
            <motion.div
              key={item.id}
              variants={{
                hidden: { opacity: 0, y: 20 },
                show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
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
