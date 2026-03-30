import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, Plus, X, CheckCircle2 } from 'lucide-react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '';

export default function GoalTracker({ walletAddress }) {
  const [goals, setGoals] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ text: '', target: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (walletAddress) {
      // Trying to fetch from API first, if it fails or if we want to follow prompt's localStorage suggestion, we can.
      // But keeping existing API logic as per "logic exists" instruction if possible.
      fetchGoals();
    }
  }, [walletAddress]);

  const fetchGoals = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/users/${walletAddress}/goals`);
      setGoals(res.data.goals || []);
    } catch (err) {
      console.error('Failed to fetch goals:', err);
      // Fallback to localStorage if API is not available
      const local = localStorage.getItem(`sm_goals_${walletAddress}`);
      if (local) setGoals(JSON.parse(local));
    }
  };

  const addGoal = async () => {
    if (!form.text || !form.target) return;
    setLoading(true);
    const newGoal = {
      text: form.text,
      target: parseFloat(form.target),
      current: 0,
      completed: false,
      _id: Date.now().toString() // Temporary ID for local state if API fails
    };

    try {
      const res = await axios.post(`${API_URL}/api/users/${walletAddress}/goals`, {
        text: form.text,
        target: parseFloat(form.target)
      });
      setGoals(res.data.goals || []);
      // Sync to localStorage as well
      localStorage.setItem(`sm_goals_${walletAddress}`, JSON.stringify(res.data.goals || []));
    } catch (err) {
      console.error('Failed to add goal via API, saving locally:', err);
      const updatedGoals = [...goals, newGoal];
      setGoals(updatedGoals);
      localStorage.setItem(`sm_goals_${walletAddress}`, JSON.stringify(updatedGoals));
    } finally {
      setForm({ text: '', target: '' });
      setShowForm(false);
      setLoading(false);
    }
  };

  const deleteGoal = async (goalId) => {
    try {
      const res = await axios.delete(`${API_URL}/api/users/${walletAddress}/goals/${goalId}`);
      setGoals(res.data.goals || []);
      localStorage.setItem(`sm_goals_${walletAddress}`, JSON.stringify(res.data.goals || []));
    } catch (err) {
      console.error('Failed to delete goal via API, updating locally:', err);
      const updatedGoals = goals.filter(g => g._id !== goalId);
      setGoals(updatedGoals);
      localStorage.setItem(`sm_goals_${walletAddress}`, JSON.stringify(updatedGoals));
    }
  };

  const getProgressColor = (pct) => {
    if (pct >= 100) return 'linear-gradient(90deg, #06B6D4, #22D3EE)';
    if (pct >= 80) return 'linear-gradient(90deg, #6366F1, #818CF8)';
    if (pct >= 50) return 'linear-gradient(90deg, #F59E0B, #FBBF24)';
    return 'linear-gradient(90deg, #EF4444, #F87171)';
  };

  const getBadgeClass = (pct) => {
    if (pct >= 100) return 'badge-cyan';
    if (pct >= 80) return 'badge-indigo';
    if (pct >= 50) return 'badge-amber';
    return 'badge-red';
  };

  return (
    <div className="card p-6 flex flex-col h-full">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display font-bold text-[16px] text-t1 m-0">Monthly Goals 🎯</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="btn btn-ghost !py-1.5 !px-3 !text-xs !gap-1.5"
        >
          <Plus size={14} /> Add Goal
        </button>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden mb-6"
          >
            <div className="p-4 rounded-xl bg-bg-elevated border border-b2 space-y-4">
              <div>
                <label className="text-[11px] text-t3 uppercase font-bold tracking-wider mb-1.5 block">Goal Description</label>
                <input
                  type="text"
                  value={form.text}
                  onChange={e => setForm(f => ({ ...f, text: e.target.value }))}
                  placeholder="e.g. Save for a journey"
                  className="input"
                />
              </div>
              <div>
                <label className="text-[11px] text-t3 uppercase font-bold tracking-wider mb-1.5 block">Target Amount (XLM)</label>
                <input
                  type="number"
                  value={form.target}
                  onChange={e => setForm(f => ({ ...f, target: e.target.value }))}
                  placeholder="0.00"
                  className="input"
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={addGoal}
                  disabled={loading}
                  className="btn btn-primary !py-2 !px-4 !text-sm flex-1"
                >
                  {loading ? 'Saving...' : 'Save'}
                </button>
                <button
                  onClick={() => setShowForm(false)}
                  className="btn btn-ghost !py-2 !px-4 !text-sm flex-1"
                >
                  Cancel
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex-1 overflow-y-auto pr-1 space-y-4 min-h-[100px]">
        {goals.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <Target size={48} className="text-t3 mb-4 opacity-50" />
            <p className="text-sm text-t2 mb-4">No goals yet. What will you achieve this month?</p>
            <button
              onClick={() => setShowForm(true)}
              className="btn btn-primary !py-2 !px-5 !text-sm"
            >
              Add Goal
            </button>
          </div>
        ) : (
          <motion.div
            layout
            className="space-y-3"
          >
            <AnimatePresence mode="popLayout">
              {goals.map((goal, index) => {
                const pct = Math.min(100, Math.round(((goal.current || 0) / goal.target) * 100));
                const isCompleted = goal.completed || pct >= 100;

                return (
                  <motion.div
                    key={goal._id || index}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className={`card p-4 transition-all ${isCompleted ? 'bg-[rgba(16,185,129,0.05)] border-green/30' : ''}`}
                  >
                    {isCompleted && (
                      <div className="badge badge-green absolute top-3 right-10 !text-[9px]">
                        ✓ Completed!
                      </div>
                    )}
                    
                    <div className="flex items-start justify-between mb-3 gap-4">
                      <h4 className={`text-sm font-medium text-t1 line-clamp-1 flex-1 ${isCompleted ? 'line-through !text-t3' : ''}`}>
                        {goal.text}
                      </h4>
                      <button
                        onClick={() => deleteGoal(goal._id)}
                        className="btn-icon !w-6 !h-6 !p-0 opacity-50 hover:opacity-100 hover:text-red transition-all"
                      >
                        <X size={14} />
                      </button>
                    </div>

                    <div className="space-y-2">
                      <div className="w-full h-1.5 bg-bg-elevated rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${pct}%` }}
                          transition={{ duration: 1, ease: 'easeOut' }}
                          className="h-full"
                          style={{ background: getProgressColor(pct) }}
                        />
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="font-mono text-[11px] text-t2 tracking-tight">
                          <span className="text-t1 font-bold">{goal.current || 0}</span> / {goal.target} XLM
                        </span>
                        <span className={`badge ${getBadgeClass(pct)} !px-1.5 !py-0.5 !text-[10px]`}>
                          {pct}%
                        </span>
                      </div>
                    </div>

                    {isCompleted && (
                      <div className="absolute inset-0 pointer-events-none overflow-hidden">
                        {[...Array(8)].map((_, i) => (
                          <div
                            key={i}
                            className="absolute left-1/2 top-1/2 w-1 h-1 rounded-sm"
                            style={{
                              background: ['#10B981', '#06B6D4', '#F59E0B', '#8B5CF6'][i % 4],
                              animation: `confetti-${i} 1s ease-out forwards`
                            }}
                          />
                        ))}
                        <style>{`
                          ${[...Array(8)].map((_, i) => `
                            @keyframes confetti-${i} {
                              0% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
                              100% { transform: translate(${(Math.random() - 0.5) * 100}px, ${(Math.random() - 0.5) * 100}px) scale(0); opacity: 0; }
                            }
                          `).join('\n')}
                        `}</style>
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  );
}
