import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '';

export default function GoalTracker({ walletAddress }) {
  const [goals, setGoals] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ text: '', target: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (walletAddress) fetchGoals();
  }, [walletAddress]);

  const fetchGoals = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/users/${walletAddress}/goals`);
      setGoals(res.data.goals || []);
    } catch {}
  };

  const addGoal = async () => {
    if (!form.text || !form.target) return;
    setLoading(true);
    try {
      const res = await axios.post(`${API_URL}/api/users/${walletAddress}/goals`, {
        text: form.text,
        target: parseFloat(form.target)
      });
      setGoals(res.data.goals || []);
      setForm({ text: '', target: '' });
      setShowModal(false);
    } catch {}
    setLoading(false);
  };

  const deleteGoal = async (goalId) => {
    try {
      const res = await axios.delete(`${API_URL}/api/users/${walletAddress}/goals/${goalId}`);
      setGoals(res.data.goals || []);
    } catch {}
  };

  return (
    <div className="glass-card p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-slate-400">Monthly Goals</h3>
        <button
          onClick={() => setShowModal(true)}
          className="text-xs px-3 py-1.5 rounded-lg font-medium transition-opacity hover:opacity-80"
          style={{ background: 'linear-gradient(135deg,#7C5CFC,#5B3FD4)', color: 'white' }}
        >
          + Add Goal
        </button>
      </div>

      {goals.length === 0 ? (
        <div className="text-center py-6">
          <span className="text-3xl">🎯</span>
          <p className="text-xs text-slate-500 mt-2">No goals yet. Set your first target!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {goals.map((goal) => {
            const pct = Math.min(100, Math.round(((goal.current || 0) / goal.target) * 100));
            return (
              <div key={goal._id} className="rounded-xl p-3" style={{ background: '#0D1425' }}>
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {goal.completed && <span className="text-green-400 text-sm">✓</span>}
                    <span className="text-xs text-white">{goal.text}</span>
                  </div>
                  <button
                    onClick={() => deleteGoal(goal._id)}
                    className="text-slate-600 hover:text-red-400 transition-colors text-xs"
                  >
                    ×
                  </button>
                </div>
                <div className="w-full rounded-full overflow-hidden mb-1" style={{ height: 6, background: '#1E293B' }}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    className="h-full rounded-full"
                    style={{ background: goal.completed ? '#00D4B4' : 'linear-gradient(90deg,#7C5CFC,#00D4B4)' }}
                  />
                </div>
                <div className="flex justify-between text-xs text-slate-500">
                  <span>{goal.current || 0} / {goal.target} XLM</span>
                  <span>{pct}%</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center px-4"
            style={{ background: 'rgba(0,0,0,0.7)' }}
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="glass-card p-6 w-full max-w-sm"
              onClick={e => e.stopPropagation()}
            >
              <h3 className="font-display font-bold text-white mb-4">Add Goal</h3>
              <input
                type="text"
                value={form.text}
                onChange={e => setForm(f => ({ ...f, text: e.target.value }))}
                placeholder="Goal description..."
                className="w-full rounded-xl px-3 py-2 text-sm text-white mb-3 outline-none"
                style={{ background: '#0D1425', border: '1px solid #1E293B' }}
              />
              <input
                type="number"
                value={form.target}
                onChange={e => setForm(f => ({ ...f, target: e.target.value }))}
                placeholder="Target XLM amount..."
                className="w-full rounded-xl px-3 py-2 text-sm text-white mb-4 outline-none"
                style={{ background: '#0D1425', border: '1px solid #1E293B' }}
              />
              <div className="flex gap-2">
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-2 rounded-xl text-sm text-slate-400 hover:text-white transition-colors"
                  style={{ background: '#0D1425', border: '1px solid #1E293B' }}
                >
                  Cancel
                </button>
                <button
                  onClick={addGoal}
                  disabled={loading}
                  className="flex-1 py-2 rounded-xl text-sm font-medium text-white disabled:opacity-50"
                  style={{ background: 'linear-gradient(135deg,#7C5CFC,#5B3FD4)' }}
                >
                  {loading ? 'Saving...' : 'Save Goal'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
