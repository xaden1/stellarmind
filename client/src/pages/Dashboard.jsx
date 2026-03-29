import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Copy, RefreshCw, LogOut, FileText, Check } from 'lucide-react';
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
import SkeletonCard from '../components/SkeletonCard';
import { truncateAddress, copyToClipboard, formatRelative } from '../utils/formatters';

export default function Dashboard({ walletAddress, onDisconnect }) {
  const navigate = useNavigate();
  const { walletData, fetchWalletData, error: horizonError } = useHorizon();
  const { analysis, analyzing, runAnalysis, sendMessage, chatHistory, chatLoading, error: aiError, clearChat } = useAI();
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
    const result = await runAnalysis(data);

    setLoadStep(2);
    await new Promise(r => setTimeout(r, 600));
    setLoaded(true);
  };

  useEffect(() => {
    if (walletAddress && !hasLoaded.current) {
      load(walletAddress);
    }
  }, [walletAddress]);

  const handleCopy = async () => {
    await copyToClipboard(walletAddress);
    setCopied(true);
    toast.success('Address copied!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReanalyze = () => {
    hasLoaded.current = false;
    load(walletAddress);
  };

  const handleDisconnect = () => {
    onDisconnect();
    navigate('/');
  };

  const topInsight = analysis?.topInsight || 'Analyzing your wallet...';
  const anomalies = analysis?.anomalies || [];

  if (!loaded) {
    return <LoadingOverlay currentStep={loadStep} />;
  }

  // Only show Horizon (blockchain) errors to the user.
  // Silently ignore AI errors since the app falls back to Mock Mode beautifully.
  const error = horizonError;

  return (
    <div style={{ paddingTop: 72, minHeight: '100vh' }}>
      <div className="max-w-screen-xl mx-auto px-4 py-6">
        {/* Top bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <div className="flex items-center gap-3">
            <button
              onClick={handleCopy}
              className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-mono"
              style={{ background: 'var(--bg-card)', color: 'var(--text-2)', border: '1px solid var(--border)' }}
            >
              <span className="w-2 h-2 rounded-full" style={{ background: 'var(--teal)' }} />
              {truncateAddress(walletAddress, 6)}
              {copied ? <Check className="w-3.5 h-3.5" style={{ color: 'var(--teal)' }} /> : <Copy className="w-3.5 h-3.5" />}
            </button>
            {walletData && (
              <span style={{ fontSize: 12, color: 'var(--text-3)' }}>
                Updated {formatRelative(walletData.fetchedAt)}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button onClick={handleReanalyze} className="btn-ghost flex items-center gap-2 text-sm py-1.5 px-3">
              <RefreshCw className="w-3.5 h-3.5" />
              Re-analyze
            </button>
            <button onClick={() => navigate('/report')} className="btn-ghost flex items-center gap-2 text-sm py-1.5 px-3">
              <FileText className="w-3.5 h-3.5" />
              Report
            </button>
            <button
              onClick={handleDisconnect}
              className="btn-ghost flex items-center gap-2 text-sm py-1.5 px-3 hover:text-red-400"
            >
              <LogOut className="w-3.5 h-3.5" />
              Disconnect
            </button>
          </div>
        </div>

        {/* Error banner (Blockchain ONLY) */}
        {error && (
          <div className="mb-4 px-4 py-3 rounded-xl text-sm" style={{ background: 'rgba(239,68,68,0.1)', color: '#EF4444', border: '1px solid rgba(239,68,68,0.2)' }}>
            ⚠️ {error}
          </div>
        )}

        {/* AI banner (disabled for cleaner demo videos) */}
        {/* {!import.meta.env.VITE_ANTHROPIC_API_KEY && (
          <div className="mb-4 px-4 py-3 rounded-xl text-sm" style={{ background: 'rgba(245,158,11,0.1)', color: 'var(--amber)', border: '1px solid rgba(245,158,11,0.2)' }}>
            💡 Running in Offline Mock Mode — Add VITE_ANTHROPIC_API_KEY for live Claude analysis.
          </div>
        )} */}

        {/* Row 1: Health + Top Insight + Mood */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-4">
          <div className="md:col-span-3">
            <HealthScoreRing
              score={analysis?.healthScore || 0}
              breakdown={analysis?.healthBreakdown || {}}
            />
          </div>
          <div className="md:col-span-5">
            <div className="card p-6 h-full flex flex-col justify-between card-purple">
              <div>
                <span className="badge badge-purple mb-3">✦ Top Insight</span>
                <p className="font-display font-bold text-white text-xl leading-snug">{topInsight}</p>
              </div>
              {analysis?.insights && (
                <div className="mt-4 space-y-2">
                  {analysis.insights.map((insight, i) => (
                    <p key={i} style={{ fontSize: 13, color: 'var(--text-2)' }}>• {insight}</p>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="md:col-span-4">
            <MoodMeter
              moodScore={analysis?.moodScore || 50}
              moodLabel={analysis?.moodLabel || 'Stable'}
            />
          </div>
        </div>

        {/* Row 2: Personality + Heatmap */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-4">
          <div className="md:col-span-4">
            <PersonalityCard
              personality={analysis?.personality || {}}
              monthlyTrend={analysis?.monthlyTrend || 'stable'}
            />
          </div>
          <div className="md:col-span-8">
            <HeatmapCalendar activityByDate={walletData?.activityByDate || {}} />
          </div>
        </div>

        {/* Row 3: Chat + Anomalies + Assets */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-4">
          <div className="md:col-span-5">
            <AskWallet
              walletAddress={walletAddress}
              walletData={walletData}
              chatHistory={chatHistory}
              onSend={(q) => sendMessage(q, walletData)}
              chatLoading={chatLoading}
              onClear={clearChat}
            />
          </div>
          <div className="md:col-span-3">
            <AnomalyAlert anomalies={anomalies} />
          </div>
          <div className="md:col-span-4">
            <AssetBreakdown assetSummary={walletData?.assets || []} />
          </div>
        </div>

        {/* Row 4: Timeline + Goals */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-4">
          <div className="md:col-span-8">
            <TransactionTimeline
              transactions={walletData?.transactions || []}
              operations={walletData?.operations || []}
            />
          </div>
          <div className="md:col-span-4">
            <GoalTracker walletAddress={walletAddress} />
          </div>
        </div>

        {/* Row 5: Network + Report */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          <div className="md:col-span-6">
            <NetworkComparison networkComparison={analysis?.networkComparison || {}} />
          </div>
          <div className="md:col-span-6">
            <div className="card p-6 h-full flex flex-col justify-between card-teal">
              <div>
                <h3 className="font-display font-bold text-white text-lg mb-2">📁 Monthly Report</h3>
                <p style={{ color: 'var(--text-2)', fontSize: 14, lineHeight: 1.6 }}>
                  Generate a comprehensive AI-written financial wellness report for your wallet — ready to print or share as PDF.
                </p>
              </div>
              <button
                onClick={() => navigate('/report')}
                className="btn-primary mt-4 w-full"
              >
                Generate Report →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
