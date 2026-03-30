import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Copy, Check, LogOut, Menu, X } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Navbar({ walletAddress, onDisconnect }) {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const isConnected = !!walletAddress;

  const truncateAddress = (addr) => {
    if (!addr) return '';
    return `${addr.slice(0, 5)}...${addr.slice(-5)}`;
  };

  const copyAddress = () => {
    if (walletAddress) {
      navigator.clipboard.writeText(walletAddress);
      setCopied(true);
      toast.success('Copied!', {
        style: {
          background: 'var(--bg-elevated)',
          color: 'var(--t1)',
          border: '1px solid var(--b2)'
        }
      });
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-[100] h-[60px] px-6 flex items-center justify-between transition-all duration-300 backdrop-blur-[20px] saturate-[180%] bg-[rgba(5,11,20,0.8)] border-b border-[var(--b1)]">
      
      {/* LEFT: Logo group */}
      <Link to="/" className="flex items-center gap-[10px]">
        <div className="w-[32px] h-[32px] rounded-full flex items-center justify-center font-display font-bold text-[13px] text-white"
             style={{ background: 'linear-gradient(135deg, var(--indigo), var(--cyan))' }}>
          SM
        </div>
        <span className="font-display font-bold text-[17px] text-grad hidden sm:block">StellarMind</span>
      </Link>

      {/* CENTER: Nav links (only when connected) */}
      {isConnected && (
        <div className="hidden md:flex items-center gap-8 relative h-full">
          <Link to="/dashboard" className="relative flex items-center h-full">
            <span className={`font-body text-[14px] font-medium transition-colors ${location.pathname === '/dashboard' ? 'text-grad' : 'text-[var(--t2)] hover:text-[var(--t1)]'}`}>
              Dashboard
            </span>
            {location.pathname === '/dashboard' && (
              <motion.div layoutId="nav-underline" className="absolute bottom-0 left-0 right-0 h-[2px]" style={{ background: 'linear-gradient(90deg, var(--indigo), var(--cyan))' }} />
            )}
          </Link>
          <Link to="/report" className="relative flex items-center h-full">
            <span className={`font-body text-[14px] font-medium transition-colors ${location.pathname === '/report' ? 'text-grad' : 'text-[var(--t2)] hover:text-[var(--t1)]'}`}>
              Report
            </span>
            {location.pathname === '/report' && (
              <motion.div layoutId="nav-underline" className="absolute bottom-0 left-0 right-0 h-[2px]" style={{ background: 'linear-gradient(90deg, var(--indigo), var(--cyan))' }} />
            )}
          </Link>
        </div>
      )}

      {/* RIGHT: Action buttons */}
      <div className="flex items-center gap-4">
        {isConnected && (
          <div className="hidden sm:flex items-center gap-4">
            {/* Wallet chip */}
            <div className="flex items-center px-[12px] py-[6px] gap-2 rounded-[20px] bg-[var(--bg-elevated)] border border-[var(--b2)] hover:border-[var(--indigo)] transition-colors group">
              <div className="w-[8px] h-[8px] rounded-full bg-[var(--green)] animate-pulseDot" />
              <span className="font-mono text-[12px] text-[var(--t1)]">
                {truncateAddress(walletAddress)}
              </span>
              <button onClick={copyAddress} className="text-[var(--t3)] hover:text-[var(--indigo)] transition-colors ml-1" title="Copy Address">
                {copied ? <Check className="w-[14px] h-[14px] text-[var(--green)]" /> : <Copy className="w-[14px] h-[14px]" />}
              </button>
            </div>

            {/* Divider */}
            <div className="w-[1px] h-[20px] bg-[var(--b2)]" />

            {/* Disconnect */}
            <button onClick={onDisconnect} className="btn btn-danger hover:border-[var(--red)] hover:text-[var(--red)] px-[12px] py-[6px] rounded-[8px] flex items-center gap-2">
              <LogOut className="w-[14px] h-[14px]" />
              <span className="hidden lg:inline">Disconnect</span>
            </button>
          </div>
        )}

        {/* Hamburger */}
        {isConnected && (
          <button className="md:hidden text-[var(--t2)] hover:text-[var(--t1)] p-2" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        )}
      </div>

      {/* MOBILE MENU */}
      <AnimatePresence>
        {menuOpen && isConnected && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="absolute top-[60px] left-0 right-0 overflow-hidden backdrop-blur-xl bg-[rgba(10,18,32,0.98)] border-b border-[var(--b1)] shadow-2xl md:hidden flex flex-col"
          >
            <Link to="/dashboard" onClick={() => setMenuOpen(false)} className={`w-full h-[48px] flex items-center px-6 border-b border-[var(--b1)] font-medium ${location.pathname === '/dashboard' ? 'text-[var(--indigo-bright)]' : 'text-[var(--t1)]'}`}>
              Dashboard
            </Link>
            <Link to="/report" onClick={() => setMenuOpen(false)} className={`w-full h-[48px] flex items-center px-6 border-b border-[var(--b1)] font-medium ${location.pathname === '/report' ? 'text-[var(--indigo-bright)]' : 'text-[var(--t1)]'}`}>
              Report
            </Link>
            <div className="w-full h-[48px] flex items-center justify-between px-6 border-b border-[var(--b1)]">
               <div className="flex items-center gap-2">
                 <div className="w-2 h-2 rounded-full bg-[var(--green)] animate-pulseDot" />
                 <span className="font-mono text-[13px] text-[var(--t2)]">{truncateAddress(walletAddress)}</span>
               </div>
               <button onClick={onDisconnect} className="text-[var(--red)] text-sm font-medium flex items-center gap-2">
                 <LogOut className="w-4 h-4" /> Disconnect
               </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
