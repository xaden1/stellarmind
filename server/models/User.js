const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  walletAddress: { type: String, required: true, unique: true },
  lastAnalysis: { type: Object },
  goals: [{
    text: String,
    target: Number,
    current: { type: Number, default: 0 },
    completed: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
  }],
  analysisHistory: [{
    date: Date,
    healthScore: Number,
    moodScore: Number
  }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', UserSchema);
