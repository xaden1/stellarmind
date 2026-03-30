import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Toaster } from 'react-hot-toast';
import { useWallet } from './hooks/useWallet';
import Navbar from './components/Navbar';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import Report from './pages/Report';

// Define the transition styles for different pages
const pageVariants = {
  initial: { opacity: 0, scale: 0.98 },
  animate: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
  exit:    { opacity: 0, scale: 1.02, transition: { duration: 0.3, ease: 'easeInOut' } },
};

function AnimatedRoutes({ walletAddress, connect, disconnect, isConnecting, error }) {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route
          path="/"
          element={
            walletAddress ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" className="w-full">
                <Landing onConnect={connect} isConnecting={isConnecting} connectError={error} />
              </motion.div>
            )
          }
        />
        <Route
          path="/dashboard"
          element={
            walletAddress ? (
              <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" className="w-full">
                <Dashboard walletAddress={walletAddress} onDisconnect={disconnect} />
              </motion.div>
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
        <Route
          path="/report"
          element={
            walletAddress ? (
              <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" className="w-full">
                <Report walletAddress={walletAddress} />
              </motion.div>
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  const { walletAddress, connect, disconnect, isConnecting, error } = useWallet();

  return (
    <BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: 'var(--bg-elevated)',
            color: 'var(--t1)',
            border: '1px solid var(--b2)',
            borderRadius: '12px',
            fontFamily: 'DM Sans, sans-serif',
            fontSize: '14px',
            backdropFilter: 'blur(10px)',
            boxShadow: 'var(--shadow-xl)',
          },
        }}
      />
      <Navbar walletAddress={walletAddress} onDisconnect={disconnect} />
      <AnimatedRoutes 
        walletAddress={walletAddress} 
        connect={connect} 
        disconnect={disconnect} 
        isConnecting={isConnecting} 
        error={error} 
      />
    </BrowserRouter>
  );
}
