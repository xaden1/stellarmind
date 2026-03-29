import { createContext, useContext, useState } from 'react';

const WalletContext = createContext(null);

export const WalletProvider = ({ children }) => {
  const [walletData, setWalletData] = useState(null);
  const [analysis, setAnalysis] = useState(null);

  return (
    <WalletContext.Provider value={{ walletData, setWalletData, analysis, setAnalysis }}>
      {children}
    </WalletContext.Provider>
  );
};

export const useWalletContext = () => useContext(WalletContext);
