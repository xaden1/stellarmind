const User = require('../models/User');

exports.getUser = async (req, res) => {
  const { walletAddress } = req.params;
  try {
    let user = await User.findOne({ walletAddress });
    if (!user) {
      user = await User.create({ walletAddress });
    }
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.saveAnalysis = async (req, res) => {
  const { walletAddress } = req.params;
  const { analysis } = req.body;
  try {
    const user = await User.findOneAndUpdate(
      { walletAddress },
      {
        lastAnalysis: analysis,
        updatedAt: new Date(),
        $push: {
          analysisHistory: {
            date: new Date(),
            healthScore: analysis.healthScore,
            moodScore: analysis.moodScore
          }
        }
      },
      { upsert: true, new: true }
    );
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.getGoals = async (req, res) => {
  const { walletAddress } = req.params;
  try {
    const user = await User.findOne({ walletAddress });
    res.json({ success: true, goals: user?.goals || [] });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.addGoal = async (req, res) => {
  const { walletAddress } = req.params;
  const { text, target } = req.body;
  try {
    const user = await User.findOneAndUpdate(
      { walletAddress },
      {
        $push: { goals: { text, target, current: 0, completed: false, createdAt: new Date() } },
        updatedAt: new Date()
      },
      { upsert: true, new: true }
    );
    res.json({ success: true, goals: user.goals });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.deleteGoal = async (req, res) => {
  const { walletAddress, goalId } = req.params;
  try {
    const user = await User.findOneAndUpdate(
      { walletAddress },
      { $pull: { goals: { _id: goalId } }, updatedAt: new Date() },
      { new: true }
    );
    res.json({ success: true, goals: user.goals });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.updateGoal = async (req, res) => {
  const { walletAddress, goalId } = req.params;
  const { current, completed } = req.body;
  try {
    const user = await User.findOneAndUpdate(
      { walletAddress, 'goals._id': goalId },
      { $set: { 'goals.$.current': current, 'goals.$.completed': completed }, updatedAt: new Date() },
      { new: true }
    );
    res.json({ success: true, goals: user.goals });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
