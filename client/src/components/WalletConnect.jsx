import { motion } from 'framer-motion';

export default function WalletConnect({ onConnect, isConnecting, error }) {
  return (
    <div className="flex flex-col items-center gap-4">
      <motion.button
        onClick={onConnect}
        disabled={isConnecting}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.97 }}
        className="relative px-8 py-4 rounded-2xl text-white font-semibold text-lg disabled:opacity-60 transition-all"
        style={{
          background: 'linear-gradient(135deg, #7C5CFC, #5B3FD4)',
          boxShadow: '0 0 30px rgba(124, 92, 252, 0.4)'
        }}
      >
        {isConnecting ? (
          <span className="flex items-center gap-2">
            <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Connecting...
          </span>
        ) : (
          <span className="flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
            Connect Freighter Wallet
          </span>
        )}
      </motion.button>

      {error && (
        <motion.p
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm text-red-400 text-center max-w-xs px-4 py-2 rounded-lg"
          style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)' }}
        >
          {error}
        </motion.p>
      )}

      <p className="text-xs text-slate-500">
        Don't have Freighter?{' '}
        <a
          href="https://freighter.app"
          target="_blank"
          rel="noreferrer"
          className="hover:underline"
          style={{ color: '#7C5CFC' }}
        >
          Install it here →
        </a>
      </p>
    </div>
  );
}
