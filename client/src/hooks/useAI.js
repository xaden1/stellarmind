import { useState, useCallback } from 'react';
import { analyzeWallet, chatWithWallet, generateMonthlyReport } from '../utils/claudeClient';

function generateFallbackAnalysis(walletData) {
  const txCount = walletData.totalTransactions || 0;
  const assetCount = walletData.assets?.length || 1;
  const healthScore = Math.min(100, 30 + txCount * 2 + assetCount * 10);
  return {
    healthScore,
    healthBreakdown: {
      stability: 60,
      activity: txCount > 5 ? 80 : 40,
      growth: 50,
      risk: 70,
    },
    personality: {
      archetype: txCount < 3 ? 'The Explorer' : txCount < 10 ? 'The Hodler' : 'The Trader',
      description: 'Your wallet is active on the Stellar testnet. Keep exploring the ecosystem!',
      emoji: '🚀',
    },
    insights: [
      `You have ${txCount} transaction${txCount !== 1 ? 's' : ''} on the testnet.`,
      `Your wallet holds ${assetCount} asset type${assetCount !== 1 ? 's' : ''}.`,
      'Add your Claude API key for deeper AI-powered insights.',
    ],
    anomalies: [],
    moodScore: healthScore,
    moodLabel: healthScore > 70 ? 'Thriving' : healthScore > 40 ? 'Stable' : 'Cautious',
    networkComparison: {
      transactionFrequency: txCount > 10 ? 'above average' : 'average',
      assetDiversity: assetCount > 2 ? 'above average' : 'average',
      summary: 'Your testnet activity looks healthy compared to new Stellar users.',
    },
    monthlyTrend: 'stable',
    topInsight: `Wallet with ${txCount} transaction${txCount !== 1 ? 's' : ''} and ${assetCount} asset${assetCount !== 1 ? 's' : ''}. Looking good!`,
  };
}

export const useAI = () => {
  const [analysis, setAnalysis] = useState(() => {
    try {
      const cached = localStorage.getItem('stellarmind_analysis');
      return cached ? JSON.parse(cached) : null;
    } catch { return null; }
  });
  const [analyzing, setAnalyzing] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const [chatLoading, setChatLoading] = useState(false);
  const [error, setError] = useState(null);

  const runAnalysis = useCallback(async (walletData) => {
    setAnalyzing(true);
    setError(null);
    try {
      const result = await analyzeWallet(walletData);
      setAnalysis(result);
      localStorage.setItem('stellarmind_analysis', JSON.stringify(result));
      return result;
    } catch (err) {
      console.warn('[StellarMind] Claude API failed, using fallback analysis:', err.message);
      setError(err.message);
      const fallback = generateFallbackAnalysis(walletData);
      setAnalysis(fallback);
      localStorage.setItem('stellarmind_analysis', JSON.stringify(fallback));
      return fallback;
    } finally {
      setAnalyzing(false);
    }
  }, []);

  const sendMessage = useCallback(async (question, walletData) => {
    setChatLoading(true);
    const userMsg = { role: 'user', content: question };
    setChatHistory(prev => [...prev, userMsg]);
    try {
      const reply = await chatWithWallet(question, walletData, chatHistory);
      const aiMsg = { role: 'assistant', content: reply };
      setChatHistory(prev => [...prev, aiMsg]);
      return reply;
    } catch (err) {
      const errMsg = { role: 'assistant', content: "I couldn't process that right now. Please check your Claude API key and try again!" };
      setChatHistory(prev => [...prev, errMsg]);
      return null;
    } finally {
      setChatLoading(false);
    }
  }, [chatHistory]);

  const getReport = useCallback(async (walletData) => {
    return generateMonthlyReport(walletData, analysis);
  }, [analysis]);

  const clearChat = useCallback(() => setChatHistory([]), []);

  return { analysis, analyzing, chatHistory, chatLoading, error, runAnalysis, sendMessage, getReport, clearChat };
};
