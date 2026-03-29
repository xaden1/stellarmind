import { useState, useCallback, useEffect } from 'react';
import { isConnected, getNetworkDetails, requestAccess } from '@stellar/freighter-api';

export const useWallet = () => {
  const [walletAddress, setWalletAddress] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState(null);

  // Auto-reconnect from localStorage on load
  useEffect(() => {
    const saved = localStorage.getItem('stellarmind_wallet');
    if (saved) setWalletAddress(saved);
  }, []);

  const connect = useCallback(async () => {
    setIsConnecting(true);
    setError(null);
    try {
      const connected = await isConnected();
      if (!connected) {
        throw new Error('Freighter wallet not found. Install the Freighter browser extension from freighter.app and set it to Testnet.');
      }
      
      // Log network for debugging
      try {
        const network = await getNetworkDetails();
        console.log('[StellarMind] Freighter network:', network?.network);
      } catch (e) {
        console.warn('Could not get network details:', e);
      }

      // Latest Freighter API uses requestAccess() to get the public key
      const result = await requestAccess();
      const publicKey = typeof result === 'string' ? result : result?.address || result?.publicKey;
      
      if (!publicKey) throw new Error('Could not retrieve public key from Freighter.');

      setWalletAddress(publicKey);
      localStorage.setItem('stellarmind_wallet', publicKey);
      return publicKey;
    } catch (err) {
      console.error('Wallet connection error:', err);
      // Fallback message if the user cancels or Freighter blocks it
      setError(err?.message || 'Failed to connect to Freighter.');
      return null;
    } finally {
      setIsConnecting(false);
    }
  }, []);

  const disconnect = useCallback(() => {
    setWalletAddress(null);
    localStorage.removeItem('stellarmind_wallet');
    localStorage.removeItem('stellarmind_analysis');
  }, []);

  return { walletAddress, isConnecting, error, connect, disconnect };
};
