const axios = require('axios');

const claudeClient = axios.create({
  baseURL: 'https://api.anthropic.com/v1',
  headers: {
    'x-api-key': process.env.ANTHROPIC_API_KEY,
    'anthropic-version': '2023-06-01',
    'Content-Type': 'application/json'
  }
});

const analyzeWallet = async (transactionData, walletAddress) => {
  const prompt = `You are StellarMind, an expert AI financial analyst for Stellar blockchain wallets.

Analyze this wallet's transaction history and return a JSON object with EXACTLY this structure (no extra text, no markdown, pure JSON only):

{
  "healthScore": <number 0-100>,
  "healthBreakdown": {
    "stability": <number 0-100>,
    "activity": <number 0-100>,
    "growth": <number 0-100>,
    "risk": <number 0-100>
  },
  "personality": {
    "archetype": "<one of: The Hodler | The Trader | The Philanthropist | The Builder | The Explorer | The Whale-in-Training>",
    "description": "<2 sentence description of this wallet's behavior>",
    "emoji": "<single relevant emoji>"
  },
  "insights": [
    "<insight 1 in plain English, max 20 words>",
    "<insight 2 in plain English, max 20 words>",
    "<insight 3 in plain English, max 20 words>"
  ],
  "anomalies": [
    {
      "date": "<YYYY-MM-DD>",
      "description": "<what was unusual, max 15 words>",
      "severity": "<low|medium|high>"
    }
  ],
  "moodScore": <number 0-100>,
  "moodLabel": "<one of: Thriving | Stable | Cautious | Volatile | Dormant>",
  "networkComparison": {
    "transactionFrequency": "<above average|average|below average>",
    "assetDiversity": "<above average|average|below average>",
    "summary": "<one sentence comparison to average Stellar user>"
  },
  "monthlyTrend": "<improving|stable|declining>",
  "topInsight": "<the single most important thing to know about this wallet, max 25 words>"
}

Wallet address: ${walletAddress}
Transaction data: ${JSON.stringify(transactionData).slice(0, 8000)}`;

  const response = await claudeClient.post('/messages', {
    model: 'claude-sonnet-4-20250514',
    max_tokens: 1500,
    messages: [{ role: 'user', content: prompt }]
  });

  const text = response.data.content[0].text;
  // strip any markdown fences if present
  const cleaned = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
  return JSON.parse(cleaned);
};

const chatWithWallet = async (question, transactionData, walletAddress, conversationHistory) => {
  const systemPrompt = `You are StellarMind, a friendly and insightful AI financial advisor for Stellar blockchain wallets. 
You have access to this wallet's complete transaction history. 
Answer questions conversationally, in plain English. Be specific with numbers and dates when relevant.
Keep responses under 150 words. Be encouraging but honest.
Wallet: ${walletAddress}
Transaction data: ${JSON.stringify(transactionData).slice(0, 3000)}`;

  const messages = [
    ...conversationHistory,
    { role: 'user', content: question }
  ];

  const response = await claudeClient.post('/messages', {
    model: 'claude-sonnet-4-20250514',
    max_tokens: 300,
    system: systemPrompt,
    messages
  });

  return response.data.content[0].text;
};

const generateReport = async (analysisData, walletAddress) => {
  const prompt = `Generate a professional monthly financial wellness report for a Stellar wallet.
Return ONLY a JSON object with this structure:
{
  "title": "StellarMind Monthly Report",
  "period": "<current month and year>",
  "summary": "<3 sentence executive summary>",
  "highlights": ["<highlight 1>", "<highlight 2>", "<highlight 3>"],
  "recommendations": ["<recommendation 1>", "<recommendation 2>", "<recommendation 3>"],
  "outlook": "<2 sentence forward-looking statement>"
}

Analysis data: ${JSON.stringify(analysisData)}
Wallet: ${walletAddress}`;

  const response = await claudeClient.post('/messages', {
    model: 'claude-sonnet-4-20250514',
    max_tokens: 800,
    messages: [{ role: 'user', content: prompt }]
  });

  const text = response.data.content[0].text;
  const cleaned = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
  return JSON.parse(cleaned);
};

module.exports = { analyzeWallet, chatWithWallet, generateReport };
