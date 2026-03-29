import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { truncateAddress } from '../utils/formatters';

export default function Navbar({ walletAddress, onDisconnect }) {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const isDashboard = location.pathname !== '/';

  const copyAddress = () => {
    if (walletAddress) {
      navigator.clipboard.writeText(walletAddress);
    }
  };

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        background: isDashboard ? 'rgba(6, 11, 24, 0.9)' : 'transparent',
        backdropFilter: isDashboard ? 'blur(12px)' : 'none',
        borderBottom: isDashboard ? '1px solid #1E293B' : 'none'
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold text-sm"
            style={{ background: 'linear-gradient(135deg, #7C5CFC, #00D4B4)' }}
          >
            SM
          </div>
          <span className="font-display font-bold text-lg text-white hidden sm:block">StellarMind</span>
        </Link>

        {/* Center Nav */}
        {walletAddress && (
          <div className="hidden md:flex items-center gap-6">
            <Link
              to="/dashboard"
              className={`text-sm font-medium transition-colors ${location.pathname === '/dashboard' ? 'text-white' : 'text-slate-400 hover:text-white'}`}
            >
              Dashboard
            </Link>
            <Link
              to="/report"
              className={`text-sm font-medium transition-colors ${location.pathname === '/report' ? 'text-white' : 'text-slate-400 hover:text-white'}`}
            >
              Report
            </Link>
          </div>
        )}

        {/* Right side */}
        <div className="flex items-center gap-3">
          {walletAddress ? (
            <>
              <button
                onClick={copyAddress}
                className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-mono text-slate-300 hover:text-white transition-colors"
                style={{ background: '#111827', border: '1px solid #1E293B' }}
              >
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ background: '#00D4B4' }}
                />
                {truncateAddress(walletAddress, 6)}
              </button>
              <button
                onClick={onDisconnect}
                className="px-3 py-1.5 rounded-lg text-xs font-medium text-red-400 hover:text-red-300 transition-colors"
                style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)' }}
              >
                Disconnect
              </button>
            </>
          ) : null}

          {/* Mobile hamburger */}
          {walletAddress && (
            <button
              className="md:hidden text-slate-400 hover:text-white"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={menuOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'} />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && walletAddress && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden px-4 pb-4"
            style={{ background: 'rgba(6,11,24,0.95)', borderTop: '1px solid #1E293B' }}
          >
            <div className="flex flex-col gap-3 pt-4">
              <Link to="/dashboard" className="text-slate-300 hover:text-white py-2" onClick={() => setMenuOpen(false)}>Dashboard</Link>
              <Link to="/report" className="text-slate-300 hover:text-white py-2" onClick={() => setMenuOpen(false)}>Report</Link>
              <p className="text-xs font-mono text-slate-500 py-2">{truncateAddress(walletAddress, 8)}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
