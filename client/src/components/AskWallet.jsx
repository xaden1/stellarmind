import React, { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Loader2 } from 'lucide-react';

const SUGGESTIONS = [
  "Was March my best month?",
  "Who do I transact with most?",
  "Am I diversified?",
  "Biggest transaction?",
  "How active this month?",
  "Any risky patterns?"
];

export default function AskWallet({ chatHistory = [], onSend, onClear, chatLoading }) {
  const [input, setInput] = useState('');
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory, chatLoading]);

  const handleSend = (text) => {
    const q = (text || input).trim();
    if (!q) return;
    onSend(q);
    setInput('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.05 }
    }
  };

  const chipItem = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
  };

  return (
    <div className="card flex flex-col h-full min-h-[500px]">
      {/* Header */}
      <div className="flex justify-between items-center px-6 py-4 border-b border-[var(--b1)] shrink-0">
        <h3 className="font-display font-semibold text-[16px] text-[var(--t1)] m-0">
          💬 Ask Your Wallet
        </h3>
        <button 
          onClick={onClear} 
          className="text-[12px] text-[var(--t3)] hover:text-[var(--t1)] transition-colors px-2 py-1"
        >
          Clear
        </button>
      </div>

      {/* Suggested chips (only when empty) */}
      {chatHistory.length === 0 && (
         <div className="px-6 pt-4 pb-2 w-full overflow-x-auto shrink-0 [&::-webkit-scrollbar]:hidden">
           <motion.div 
             variants={staggerContainer} 
             initial="hidden" 
             animate="show" 
             className="flex gap-2"
           >
             {SUGGESTIONS.map((str, i) => (
                <motion.button
                   key={i}
                   variants={chipItem}
                   whileTap={{ scale: 0.97 }}
                   onClick={() => handleSend(str)}
                   className="whitespace-nowrap bg-[var(--bg-elevated)] border border-[var(--b2)] rounded-[20px] px-[14px] py-[6px] text-[13px] text-[var(--t2)] hover:text-[var(--t1)] hover:border-[var(--indigo)] hover:bg-[var(--indigo-dim)] transition-colors cursor-pointer"
                >
                  {str}
                </motion.button>
             ))}
           </motion.div>
         </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-4 flex flex-col gap-5 [&::-webkit-scrollbar]:w-[4px] [&::-webkit-scrollbar-thumb]:bg-[var(--indigo)] [&::-webkit-scrollbar-track]:bg-transparent">
        <AnimatePresence>
          {chatHistory.map((msg, idx) => {
            const isUser = msg.role === 'user';
            const timeStr = new Date(msg.timestamp || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: isUser ? 10 : -10 }}
                animate={{ opacity: 1, x: 0 }}
                className={`flex gap-[10px] w-full ${isUser ? 'justify-end' : 'justify-start items-start'}`}
              >
                {!isUser && (
                  <div className="w-[28px] h-[28px] rounded-full shrink-0 flex items-center justify-center text-white font-display text-[10px] bg-[linear-gradient(135deg,var(--indigo),var(--cyan))]">
                    SM
                  </div>
                )}
                
                <div className="flex flex-col gap-1" style={{ alignItems: isUser ? 'flex-end' : 'flex-start' }}>
                  <div
                    className="px-[16px] py-[12px] text-[14px] font-body leading-[1.6]"
                    style={{
                      maxWidth: '85%',
                      background: isUser ? 'linear-gradient(135deg, var(--indigo), #4F46E5)' : 'var(--bg-elevated)',
                      border: isUser ? 'none' : '1px solid var(--b2)',
                      borderRadius: isUser ? '16px 4px 16px 16px' : '4px 16px 16px 16px',
                      color: isUser ? 'white' : 'var(--t1)'
                    }}
                  >
                    {msg.content}
                  </div>
                  <span className="text-[10px] text-[var(--t3)] font-mono px-1">{timeStr}</span>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {/* Loading Indicator */}
        {chatLoading && (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex gap-[10px] items-start w-full justify-start"
          >
            <div className="w-[28px] h-[28px] rounded-full shrink-0 flex items-center justify-center text-white font-display text-[10px] bg-[linear-gradient(135deg,var(--indigo),var(--cyan))]">
              SM
            </div>
            <div className="px-[16px] py-[12px] bg-[var(--bg-elevated)] border border-[var(--b2)] rounded-[4px_16px_16px_16px] flex gap-1 h-[46px] items-center">
               <span className="chat-dot" />
               <span className="chat-dot" />
               <span className="chat-dot" />
            </div>
          </motion.div>
        )}
        
        <div ref={bottomRef} />
      </div>

      {/* Input Area */}
      <div className="flex gap-[8px] px-6 py-4 border-t border-[var(--b1)] shrink-0 items-center bg-[var(--bg-surface)]">
         <input 
           type="text"
           value={input}
           onChange={(e) => setInput(e.target.value)}
           onKeyDown={handleKeyDown}
           placeholder="Ask anything about your wallet..."
           disabled={chatLoading}
           className="input flex-1"
         />
         <motion.button
           whileTap={(!chatLoading && input.trim()) ? { scale: 0.95 } : {}}
           onClick={() => handleSend()}
           disabled={chatLoading || !input.trim()}
           className="btn btn-primary w-[40px] h-[40px] shrink-0 p-0 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
           style={{ padding: 0 }} // Override padding
         >
           {chatLoading ? <Loader2 className="w-[14px] h-[14px] animate-spin" /> : <Send className="w-[14px] h-[14px]" />}
         </motion.button>
      </div>

    </div>
  );
}
