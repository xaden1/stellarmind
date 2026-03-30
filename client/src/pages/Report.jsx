import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Printer, Loader2, FileText, Target, Activity, TrendingUp, ShieldCheck, Download, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';

import { useHorizon } from '../hooks/useHorizon';
import { useAI } from '../hooks/useAI';
import { truncateAddress } from '../utils/formatters';

export default function Report({ walletAddress }) {
  const navigate = useNavigate();
  const { walletData, fetchWalletData } = useHorizon();
  const { analysis, getReport } = useAI();
  const [report, setReport] = useState(null);
  const [generating, setGenerating] = useState(false);

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      let data = walletData;
      if (!data) data = await fetchWalletData(walletAddress);
      if (!data) { setGenerating(false); return; }
      
      const r = await getReport(data);
      setReport(r);
      toast.success('Report generated successfully!');
    } catch (e) {
      console.error('Report generation failed:', e);
      toast.error(e.message || 'Failed to generate report.');
    } finally {
      setGenerating(false);
    }
  };

  const today = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

  const containerVars = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const itemVars = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
  };

  return (
    <div className="min-h-screen bg-bg-base overflow-x-hidden relative" style={{ paddingTop: 80 }}>
      
      {/* Top Bar / Controls */}
      <div className="no-print sticky top-[80px] z-50 bg-bg-base/80 backdrop-blur-md border-b border-b1 px-6 py-4">
        <div className="max-w-[800px] mx-auto flex items-center justify-between">
           <button onClick={() => navigate('/dashboard')} className="btn btn-ghost !py-2 !px-4 !text-sm !gap-2">
              <ArrowLeft size={16} /> Back to Dashboard
           </button>
           <div className="flex gap-3">
              {!report && (
                <button 
                  onClick={handleGenerate} 
                  disabled={generating} 
                  className="btn btn-primary !py-2 !px-6 !text-sm !gap-2 shadow-glow-indigo"
                >
                  {generating ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
                  {generating ? 'Generating AI Report...' : 'Generate AI Report'}
                </button>
              )}
           </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-[720px] mx-auto px-6 py-12 relative z-10 print:max-w-none print:p-0">
        
        {!report && !generating && (
           <div className="flex flex-col items-center justify-center text-center py-20">
              <div className="w-20 h-20 rounded-full bg-indigo-dim flex items-center justify-center text-indigo mb-6">
                 <FileText size={40} />
              </div>
              <h2 className="font-display font-bold text-3xl text-t1 mb-4">Financial Wellness Report</h2>
              <p className="font-body text-t2 text-lg max-w-md mb-8">
                 Get a comprehensive, AI-written analysis of your on-chain behavior and health score highlights.
              </p>
              <button onClick={handleGenerate} className="btn btn-primary !h-14 !px-8 !text-lg !gap-3">
                 <Sparkles size={20} /> Build Report Now
              </button>
           </div>
        )}

        {generating && (
           <div className="flex flex-col items-center justify-center text-center py-20">
              <div className="relative w-24 h-24 mb-8">
                 <div className="absolute inset-0 border-4 border-indigo-dim rounded-full" />
                 <div className="absolute inset-0 border-4 border-indigo border-t-transparent rounded-full animate-spin" />
                 <div className="absolute inset-0 flex items-center justify-center">
                    <Sparkles size={32} className="text-indigo animate-pulse" />
                 </div>
              </div>
              <h2 className="font-display font-bold text-2xl text-t1 mb-2">Claude is writing your report...</h2>
              <p className="font-body text-t2">Analyzing transaction history and calculating trends</p>
           </div>
        )}

        {report && (
           <motion.div 
             variants={containerVars} initial="hidden" animate="show"
             className="space-y-16"
           >
              {/* Header section */}
              <motion.div variants={itemVars} className="text-center print:text-left pt-8">
                 <h1 className="font-display font-extrabold text-[#F1F5F9] leading-tight mb-4 text-[42px] tracking-tight">
                    Financial Wellness <span className="text-grad">Report</span>
                 </h1>
                 <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-t3 font-body text-sm uppercase tracking-widest font-bold">
                    <span>Account: {truncateAddress(walletAddress, 8)}</span>
                    <span className="hidden sm:block text-t4 opacity-30">•</span>
                    <span>Date: {today}</span>
                 </div>
                 <div className="w-24 h-1.5 bg-grad-indigo rounded-full mx-auto sm:mx-0 sm:mr-auto mt-10" />
              </motion.div>

              {/* 1. Executive Summary */}
              <motion.div variants={itemVars} className="space-y-6">
                 <div className="flex items-center gap-3 text-t1">
                    <Target className="text-indigo" size={24} />
                    <h2 className="font-display font-bold text-[22px] m-0">Executive Summary</h2>
                 </div>
                 <div className="border-l-4 border-indigo/30 pl-8 relative">
                    <p className="font-body text-[17px] text-t1 leading-[1.8] font-medium italic opacity-90">
                       "{report.summary || 'Your wallet activity shows a consistent level of engagement with the Stellar network over the observed period.'}"
                    </p>
                 </div>
              </motion.div>

              {/* 2. Key Metrics Breakdown */}
              <motion.div variants={itemVars} className="space-y-6">
                 <div className="flex items-center gap-3 text-t1">
                    <Activity className="text-cyan" size={24} />
                    <h2 className="font-display font-bold text-[22px] m-0">Key Metrics</h2>
                 </div>
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="card-minimal border border-b2 p-6 rounded-2xl flex flex-col items-center text-center">
                       <span className="text-[12px] uppercase font-bold text-t3 tracking-widest mb-3">Health Score</span>
                       <span className="font-display font-bold text-[48px] text-grad leading-none mb-2">{analysis?.healthScore || 0}</span>
                       <span className="badge badge-indigo">Elite Performer</span>
                    </div>
                    <div className="card-minimal border border-b2 p-6 rounded-2xl flex flex-col items-center text-center">
                       <span className="text-[12px] uppercase font-bold text-t3 tracking-widest mb-3">Current Grade</span>
                       <span className="font-display font-bold text-[48px] text-t1 leading-none mb-2">{report.grade || 'A'}</span>
                       <span className={`badge ${report.grade?.startsWith('A') ? 'badge-green' : 'badge-amber'}`}>Calculated vs. Network</span>
                    </div>
                 </div>
              </motion.div>

              {/* 3. Behavioral Analysis Highlights */}
              <motion.div variants={itemVars} className="space-y-6">
                 <div className="flex items-center gap-3 text-t1">
                    <TrendingUp className="text-indigo" size={24} />
                    <h2 className="font-display font-bold text-[22px] m-0">Behavioral Highlights</h2>
                 </div>
                 <div className="space-y-4">
                    {report.highlights?.map((hl, i) => (
                      <div key={i} className="flex gap-4 p-5 rounded-[12px] bg-bg-elevated/50 border border-b2 group hover:border-indigo/50 transition-colors">
                         <div className="w-8 h-8 rounded-full bg-indigo-dim flex items-center justify-center text-indigo shrink-0 mt-0.5">
                            <span className="font-bold text-[13px]">{i + 1}</span>
                         </div>
                         <p className="font-body text-[15px] text-t2 leading-relaxed m-0">{hl}</p>
                      </div>
                    ))}
                 </div>
              </motion.div>

              {/* 4. Strategic Recommendations */}
              <motion.div variants={itemVars} className="space-y-6">
                 <div className="flex items-center gap-3 text-t1">
                    <ShieldCheck className="text-cyan" size={24} />
                    <h2 className="font-display font-bold text-[22px] m-0">Strategic Recommendations</h2>
                 </div>
                 <div className="bg-grad-cyan-dim rounded-[24px] p-8 border border-cyan/20">
                    <ul className="space-y-6 m-0 p-0 list-none">
                       {report.recommendations?.map((rec, i) => (
                         <li key={i} className="flex gap-4 items-start">
                            <div className="mt-1.5 shrink-0 w-2 h-2 rounded-full bg-cyan shadow-[0_0_8px_var(--cyan)]" />
                            <p className="m-0 font-body text-t1 text-[16px] leading-[1.6]">
                               {rec}
                            </p>
                         </li>
                       ))}
                    </ul>
                 </div>
              </motion.div>

              {/* Summary Conclusion */}
              <motion.div variants={itemVars} className="pt-8 border-t border-b1">
                 <div className="p-8 rounded-[24px] border border-b1 bg-bg-surface flex flex-col sm:flex-row items-center gap-8 shadow-inner">
                    <div className="w-24 h-24 items-center justify-center hidden sm:flex shrink-0">
                       <FileText size={48} className="text-t3 opacity-20" />
                    </div>
                    <div>
                       <h3 className="font-display font-bold text-[18px] text-t1 mb-2 m-0">Network Outlook</h3>
                       <p className="font-body text-t2 text-[14px] leading-relaxed mb-0">
                          {report.outlook || 'The Stellar network is evolving, and your pattern of interaction suggests safe growth potential. Continue utilizing the dashboard to track your performance relative to the global average.'}
                       </p>
                    </div>
                 </div>
              </motion.div>

              {/* Print Footer */}
              <motion.div variants={itemVars} className="text-center pt-8 pb-12 opacity-40">
                 <p className="font-mono text-[10px] uppercase tracking-widest text-t3">
                    Verified Digital Report • Generated by StellarMind Engine • {today}
                 </p>
              </motion.div>

           </motion.div>
        )}
      </div>

      {/* Floating Action Button (FAB) */}
      <AnimatePresence>
        {report && (
           <motion.button
             initial={{ scale: 0, opacity: 0 }}
             animate={{ scale: 1, opacity: 1 }}
             exit={{ scale: 0, opacity: 0 }}
             whileHover={{ scale: 1.05 }}
             whileTap={{ scale: 0.95 }}
             onClick={() => window.print()}
             className="no-print fixed bottom-8 right-8 w-16 h-16 rounded-full bg-indigo shadow-glow-indigo text-white flex items-center justify-center z-[100] group"
           >
              <Download size={24} className="group-hover:translate-y-0.5 transition-transform" />
              {/* Tooltip */}
              <div className="absolute right-20 bg-bg-surface border border-b2 px-3 py-1.5 rounded-lg text-xs font-bold text-t1 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                 Print / Save as PDF
              </div>
           </motion.button>
        )}
      </AnimatePresence>

    </div>
  );
}
