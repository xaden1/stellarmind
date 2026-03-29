import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Toaster } from 'react-hot-toast';
import { useWallet } from './hooks/useWallet';
import Navbar from './components/Navbar';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import Report from './pages/Report';

const pageVariants = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.35 } },
  exit:    { opacity: 0, y: -10, transition: { duration: 0.2 } },
};

export default function App() {
  const { walletAddress, connect, disconnect, isConnecting, error } = useWallet();

  return (
    <BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#0F1629',
            color: '#F8FAFC',
            border: '1px solid rgba(124,92,252,0.3)',
            borderRadius: '10px',
            fontFamily: 'DM Sans, sans-serif',
            fontSize: 14,
          },
        }}
      />
      <Navbar walletAddress={walletAddress} onDisconnect={disconnect} />
      <AnimatePresence mode="wait">
        <Routes>
          <Route
            path="/"
            element={
              walletAddress ? (
                <Navigate to="/dashboard" replace />
              ) : (
                <motion.div key="landing" variants={pageVariants} initial="initial" animate="animate" exit="exit">
                  <Landing onConnect={connect} isConnecting={isConnecting} connectError={error} />
                </motion.div>
              )
            }
          />
          <Route
            path="/dashboard"
            element={
              walletAddress ? (
                <motion.div key="dashboard" variants={pageVariants} initial="initial" animate="animate" exit="exit">
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
                <motion.div key="report" variants={pageVariants} initial="initial" animate="animate" exit="exit">
                  <Report walletAddress={walletAddress} />
                </motion.div>
              ) : (
                <Navigate to="/" replace />
              )
            }
          />
        </Routes>
      </AnimatePresence>
    </BrowserRouter>
  );
}
