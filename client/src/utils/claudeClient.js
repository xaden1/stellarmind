// Note: API key exposed in browser bundle — acceptable for testnet/hackathon dApp.
// For production, proxy through a BFF (Backend-For-Frontend) instead.
const ANTHROPIC_API_KEY = import.meta.env.VITE_ANTHROPIC_API_KEY;
const CLAUDE_API_URL = 'https://api.anthropic.com/v1/messages';

const callClaude = async (messages, system = null, maxTokens = 1000) => {
  if (!ANTHROPIC_API_KEY) throw new Error('VITE_ANTHROPIC_API_KEY is not set in your .env file');

  const body = {
    model: 'claude-sonnet-4-20250514',
    max_tokens: maxTokens,
    messages,
  };
  if (system) body.system = system;

  const res = await fetch(CLAUDE_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || `Claude API error: ${res.status}`);
  }

  const data = await res.json();
  return data.content[0].text;
};

export const analyzeWallet = async (walletData) => {
  const summary = {
    walletAddress: walletData.walletAddress,
    assets: walletData.assets,
    totalTransactions: walletData.totalTransactions,
    recentTransactions: walletData.transactions.slice(0, 20),
    recentOperations: walletData.operations.slice(0, 30),
    activityByDate: walletData.activityByDate,
  };

  const prompt = `You are StellarMind, an expert AI financial analyst for Stellar blockchain wallets.

Analyze this Stellar testnet wallet and return ONLY a valid JSON object. No extra text. No markdown fences. Pure JSON only.

Required JSON structure:
{
  "healthScore": <integer 0-100>,
  "healthBreakdown": {
    "stability": <integer 0-100>,
    "activity": <integer 0-100>,
    "growth": <integer 0-100>,
    "risk": <integer 0-100>
  },
  "personality": {
    "archetype": "<exactly one of: The Hodler | The Trader | The Philanthropist | The Builder | The Explorer | The Whale-in-Training>",
    "description": "<2 engaging sentences describing this wallet's financial behavior>",
    "emoji": "<single emoji>"
  },
  "insights": [
    "<insight 1, plain English, max 20 words>",
    "<insight 2, plain English, max 20 words>",
    "<insight 3, plain English, max 20 words>"
  ],
  "anomalies": [
    {
      "date": "<YYYY-MM-DD>",
      "description": "<what was unusual, max 15 words>",
      "severity": "<low|medium|high>"
    }
  ],
  "moodScore": <integer 0-100>,
  "moodLabel": "<exactly one of: Thriving | Stable | Cautious | Volatile | Dormant>",
  "networkComparison": {
    "transactionFrequency": "<above average|average|below average>",
    "assetDiversity": "<above average|average|below average>",
    "summary": "<one sentence comparison>"
  },
  "monthlyTrend": "<improving|stable|declining>",
  "topInsight": "<single most important observation, max 25 words>"
}

Wallet data: ${JSON.stringify(summary)}`;

  const text = await callClaude([{ role: 'user', content: prompt }], null, 1500);
  const cleaned = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
  return JSON.parse(cleaned);
};

export const chatWithWallet = async (question, walletData, conversationHistory = []) => {
  // Try real API first
  if (ANTHROPIC_API_KEY && ANTHROPIC_API_KEY !== 'your_claude_api_key_here') {
    const system = `You are StellarMind, a friendly AI financial advisor for Stellar blockchain wallets.
You have access to this wallet's transaction history. Answer conversationally in plain English.
Be specific with numbers and dates when relevant. Keep responses under 120 words. Be encouraging but honest.

Wallet: ${walletData.walletAddress}
Assets: ${JSON.stringify(walletData.assets)}
Total transactions: ${walletData.totalTransactions}
Recent operations: ${JSON.stringify(walletData.operations.slice(0, 15))}`;

    const messages = [
      ...conversationHistory.slice(-8),
      { role: 'user', content: question },
    ];
    try {
      return await callClaude(messages, system, 250);
    } catch (e) {
      console.warn('Real AI chat failed, falling back to mock response:', e.message);
    }
  }

  // --- MOCK MODE FOR API-LESS DEMOS ---
  await new Promise(r => setTimeout(r, 1500)); // fake delay
  const txCount = walletData.totalTransactions;
  const lowerQ = question.toLowerCase();
  
  if (lowerQ.includes('hello') || lowerQ.includes('hi')) {
    return "Hello! I'm StellarMind. I can see your wallet has completed " + txCount + " transactions so far. What would you like to know about your financial history?";
  }
  if (lowerQ.includes('best') || lowerQ.includes('month') || lowerQ.includes('active')) {
    return "Looking at your on-chain history, your most active period was recently, with multiple asset transfers. You seem to favor holding XLM while exploring the testnet ecosystem. Keep it up!";
  }
  if (lowerQ.includes('advice') || lowerQ.includes('recommend')) {
    return "Based on your behavior archetype, my main piece of advice is to start setting monthly XLM goals using the Goal Tracker. Also, consider diversifying your assets across more stablecoins if you plan to trade!";
  }
  return "That's a great question about your wallet history! Based on your " + txCount + " transactions, your account shows strong stability and consistent network activity. Because I'm running in 'Mock Mode' without an API key right now, I can only give general insights. Please add an Anthropic key to `.env` for deep, specific answers!";
};

export const generateMonthlyReport = async (walletData, analysis) => {
  if (ANTHROPIC_API_KEY && ANTHROPIC_API_KEY !== 'your_claude_api_key_here') {
    const prompt = `Generate a professional monthly financial wellness report for a Stellar wallet.
Return ONLY a valid JSON object. No extra text. No markdown.

{
  "period": "<current month year e.g. March 2026>",
  "summary": "<3 sentence executive summary of wallet performance>",
  "highlights": ["<positive highlight 1>", "<positive highlight 2>", "<positive highlight 3>"],
  "recommendations": ["<actionable recommendation 1>", "<actionable recommendation 2>", "<actionable recommendation 3>"],
  "outlook": "<2 sentence forward-looking statement>",
  "grade": "<letter grade A+ to F>"
}

Wallet: ${walletData.walletAddress}
Health Score: ${analysis?.healthScore}
Personality: ${analysis?.personality?.archetype}
Mood: ${analysis?.moodLabel}
Top Insight: ${analysis?.topInsight}
Assets: ${JSON.stringify(walletData.assets)}`;

    try {
      const text = await callClaude([{ role: 'user', content: prompt }], null, 600);
      const cleaned = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      return JSON.parse(cleaned);
    } catch (e) {
      console.warn('Real AI report failed, falling back to mock report:', e.message);
    }
  }

  // --- MOCK MODE FOR API-LESS DEMOS ---
  await new Promise(r => setTimeout(r, 2000)); // fake delay
  return {
    period: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
    summary: `Your Stellar wallet continues to show ${analysis?.moodLabel?.toLowerCase() || 'stable'} performance. Over the past month, your activity strongly aligned with "${analysis?.personality?.archetype || 'The Explorer'}" archetype. Network interactions remained consistent with no critical security anomalies detected.`,
    highlights: [
      `Maintained a strong Health Score of ${analysis?.healthScore || 75}/100`,
      `Executed ${walletData.totalTransactions} total transactions on the Stellar network`,
      `Successfully interacted with ${walletData.assets?.length || 1} unique assets`
    ],
    recommendations: [
      "Set a monthly transaction goal to increase your Activity score",
      "Diversify your testnet portfolio by exploring Stellar DEX pairs",
      "Regularly review your connected smart contracts and authorizations"
    ],
    outlook: "Your fundamental on-chain metrics look exceptionally healthy. Expect continued stability if your current transaction patterns are maintained.",
    grade: (analysis?.healthScore || 75) > 80 ? "A-" : "B+"
  };
};
