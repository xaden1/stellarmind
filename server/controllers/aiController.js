const { analyzeWallet, chatWithWallet, generateReport } = require('../utils/claudeClient');

exports.analyzeWallet = async (req, res) => {
  const { walletAddress, walletData } = req.body;
  if (!walletAddress || !walletData) {
    return res.status(400).json({ success: false, error: 'walletAddress and walletData are required' });
  }
  try {
    const analysis = await analyzeWallet(walletData, walletAddress);
    res.json({ success: true, analysis });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.chat = async (req, res) => {
  const { question, walletData, walletAddress, conversationHistory = [] } = req.body;
  if (!question || !walletAddress) {
    return res.status(400).json({ success: false, error: 'question and walletAddress are required' });
  }
  try {
    const reply = await chatWithWallet(question, walletData, walletAddress, conversationHistory);
    res.json({ success: true, reply });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.generateReport = async (req, res) => {
  const { analysisData, walletAddress } = req.body;
  if (!walletAddress) {
    return res.status(400).json({ success: false, error: 'walletAddress is required' });
  }
  try {
    const report = await generateReport(analysisData, walletAddress);
    res.json({ success: true, report });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
