import { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const SUGGESTIONS = [
  "Was last month my best month?",
  "Who do I send money to most?",
  "Am I diversified enough?",
  "What's my biggest transaction?",
];

export default function AskWallet({ walletAddress, walletData, chatHistory = [], onSend, chatLoading }) {
  const [input, setInput] = useState('');
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory, chatLoading]);

  const handleSend = (text) => {
    const q = text || input.trim();
    if (!q) return;
    onSend(q);
    setInput('');
  };

  return (
    <div className="glass-card flex flex-col" style={{ height: 420 }}>
      <div className="px-5 py-4 border-b" style={{ borderColor: '#1E293B' }}>
        <h3 className="text-sm font-medium text-white flex items-center gap-2">
          <span className="text-lg">💬</span> Ask Your Wallet
        </h3>
        <p className="text-xs text-slate-500 mt-0.5">Chat with your transaction history in plain English</p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
        {chatHistory.length === 0 && (
          <div className="text-center py-8">
            <div className="text-3xl mb-2">🤖</div>
            <p className="text-xs text-slate-500">Hi! I'm StellarMind. Ask me anything about your wallet.</p>
          </div>
        )}
        {chatHistory.map((msg, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} gap-2`}
          >
            {msg.role === 'assistant' && (
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold text-white"
                style={{ background: 'linear-gradient(135deg,#7C5CFC,#00D4B4)' }}
              >
                SM
              </div>
            )}
            <div
              className={`max-w-xs px-3 py-2 text-xs leading-relaxed ${msg.role === 'user' ? 'chat-bubble-user text-white' : 'chat-bubble-ai text-slate-300'}`}
            >
              {msg.content}
            </div>
          </motion.div>
        ))}
        {chatLoading && (
          <div className="flex justify-start gap-2">
            <div
              className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold text-white"
              style={{ background: 'linear-gradient(135deg,#7C5CFC,#00D4B4)' }}
            >
              SM
            </div>
            <div className="chat-bubble-ai px-4 py-2.5">
              <div className="flex gap-1">
                {[0,1,2].map(i => (
                  <motion.div
                    key={i}
                    className="w-1.5 h-1.5 rounded-full bg-slate-400"
                    animate={{ opacity: [0.3,1,0.3] }}
                    transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Suggestions */}
      {chatHistory.length < 2 && (
        <div className="px-4 py-2 flex gap-2 overflow-x-auto">
          {SUGGESTIONS.map((s, i) => (
            <button
              key={i}
              onClick={() => handleSend(s)}
              className="flex-shrink-0 px-3 py-1.5 rounded-full text-xs text-slate-300 hover:text-white transition-colors whitespace-nowrap"
              style={{ background: '#0D1425', border: '1px solid #1E293B' }}
            >
              {s}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="px-4 py-3 border-t flex gap-2" style={{ borderColor: '#1E293B' }}>
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSend()}
          placeholder="Ask about your wallet..."
          className="flex-1 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 outline-none focus:ring-1"
          style={{ background: '#0D1425', border: '1px solid #1E293B', '--tw-ring-color': '#7C5CFC' }}
          disabled={chatLoading}
        />
        <button
          onClick={() => handleSend()}
          disabled={chatLoading || !input.trim()}
          className="w-9 h-9 rounded-xl flex items-center justify-center transition-opacity disabled:opacity-40"
          style={{ background: 'linear-gradient(135deg,#7C5CFC,#5B3FD4)' }}
        >
          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
        </button>
      </div>
    </div>
  );
}
