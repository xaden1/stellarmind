import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Copy, Check, LogOut, Menu, X } from 'lucide-react';
import toast from 'react-hot-toast';
import BrandLogo from './BrandLogo';

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
      toast.success('Address copied!', {
        style: {
          background: 'var(--glass-bg)',
          color: 'var(--t1)',
          border: '1px solid var(--glass-border)',
          backdropFilter: 'blur(20px)',
        },
      });
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const navLinkClass = (path) =>
    `relative flex items-center h-full font-body text-[14px] font-medium transition-colors duration-150 ${
      location.pathname === path ? 'text-grad' : 'text-[var(--t2)] hover:text-[var(--t1)]'
    }`;

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-[100] h-[60px] px-6 flex items-center justify-between glass-nav transition-all duration-300"
      style={{ zIndex: 100 }}
    >
      {/* LEFT: Logo */}
      <Link to="/" className="flex items-center" aria-label="StellarMind Home">
        <BrandLogo size="sm" showName />
      </Link>

      {/* CENTER: Nav links */}
      {isConnected && (
        <div className="hidden md:flex items-center gap-8 relative h-full">
          <Link to="/dashboard" className={navLinkClass('/dashboard')}>
            Dashboard
            {location.pathname === '/dashboard' && (
              <motion.div
                layoutId="nav-underline"
                className="absolute bottom-0 left-0 right-0 h-[2px]"
                style={{ background: 'linear-gradient(90deg, var(--indigo), var(--cyan))' }}
              />
            )}
          </Link>
          <Link to="/report" className={navLinkClass('/report')}>
            Report
            {location.pathname === '/report' && (
              <motion.div
                layoutId="nav-underline"
                className="absolute bottom-0 left-0 right-0 h-[2px]"
                style={{ background: 'linear-gradient(90deg, var(--indigo), var(--cyan))' }}
              />
            )}
          </Link>
        </div>
      )}

      {/* RIGHT: Wallet chip + actions */}
      <div className="flex items-center gap-3">
        {isConnected && (
          <div className="hidden sm:flex items-center gap-3">
            {/* Wallet chip */}
            <button
              onClick={copyAddress}
              title="Copy wallet address"
              className="flex items-center px-3 py-1.5 gap-2 rounded-full transition-all duration-200 group"
              style={{
                background: 'var(--glass-bg)',
                border: '1px solid var(--glass-border)',
                backdropFilter: 'blur(16px)',
              }}
              onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--glass-border-hover)'}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--glass-border)'}
            >
              <span
                className="w-2 h-2 rounded-full flex-shrink-0"
                style={{ background: 'var(--green)', boxShadow: '0 0 8px var(--green)' }}
              />
              <span className="font-mono text-[12px] text-[var(--t1)]">
                {truncateAddress(walletAddress)}
              </span>
              {copied
                ? <Check className="w-3 h-3 text-[var(--green)]" />
                : <Copy className="w-3 h-3 text-[var(--t3)] group-hover:text-[var(--t1)] transition-colors" />
              }
            </button>

            {/* Divider */}
            <div className="w-px h-4 bg-[var(--b2)]" />

            {/* Disconnect */}
            <button
              id="disconnect-btn"
              onClick={onDisconnect}
              className="btn btn-muted !py-1.5 !px-4 !text-[13px] !gap-1.5"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden lg:inline">Disconnect</span>
            </button>
          </div>
        )}

        {/* Mobile hamburger */}
        {isConnected && (
          <button
            className="md:hidden btn btn-icon"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          >
            {menuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
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
            transition={{ duration: 0.2 }}
            className="absolute top-[60px] left-0 right-0 overflow-hidden md:hidden"
            style={{
              background: 'var(--glass-bg)',
              backdropFilter: 'blur(28px)',
              borderBottom: '1px solid var(--glass-border)',
              boxShadow: '0 8px 32px rgba(99,102,241,0.06)'
            }}
          >
            <Link
              to="/dashboard"
              onClick={() => setMenuOpen(false)}
              className={`w-full h-12 flex items-center px-6 border-b border-[var(--b1)] font-medium text-[15px] transition-colors ${
                location.pathname === '/dashboard' ? 'text-[var(--indigo-bright)]' : 'text-[var(--t1)]'
              }`}
            >
              Dashboard
            </Link>
            <Link
              to="/report"
              onClick={() => setMenuOpen(false)}
              className={`w-full h-12 flex items-center px-6 border-b border-[var(--b1)] font-medium text-[15px] transition-colors ${
                location.pathname === '/report' ? 'text-[var(--indigo-bright)]' : 'text-[var(--t1)]'
              }`}
            >
              Report
            </Link>
            <div className="w-full h-12 flex items-center justify-between px-6 border-b border-[var(--b1)]">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[var(--green)]" style={{ boxShadow: '0 0 6px var(--green)' }} />
                <span className="font-mono text-[13px] text-[var(--t2)]">{truncateAddress(walletAddress)}</span>
              </div>
              <button
                onClick={onDisconnect}
                className="text-[var(--red)] text-sm font-medium flex items-center gap-2 hover:opacity-80 transition-opacity"
              >
                <LogOut className="w-4 h-4" /> Disconnect
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
