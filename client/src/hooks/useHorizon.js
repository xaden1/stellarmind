import { useState, useCallback } from 'react';
import { fetchAllWalletData } from '../utils/horizonClient';

export const useHorizon = () => {
  const [walletData, setWalletData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchWalletData = useCallback(async (walletAddress) => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchAllWalletData(walletAddress);
      setWalletData(data);
      return data;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { walletData, loading, error, fetchWalletData };
};
