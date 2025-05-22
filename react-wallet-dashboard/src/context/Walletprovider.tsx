// src/context/WalletProvider.tsx
import React, { createContext, useState, useEffect, useCallback } from "react";
import { ethers } from "ethers";

interface WalletContextType {
  address: string | null;
  network: string | null;
  connectWallet: () => Promise<void>;
}

export const WalletContext = createContext<WalletContextType>({
  address: null,
  network: null,
  connectWallet: async () => {},
});

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [address, setAddress] = useState<string | null>(null);
  const [network, setNetwork] = useState<string | null>(null);

  const connectWallet = useCallback(async () => {
    if (!window.ethereum) {
      alert("MetaMask is required.");
      return;
    }
    const provider = new ethers.BrowserProvider(window.ethereum);
    const accounts = await provider.send("eth_requestAccounts", []);
    const network = await provider.getNetwork();
    setAddress(accounts[0]);
    setNetwork(network.name);
  }, []);

  return (
    <WalletContext.Provider value={{ address, network, connectWallet }}>
      {children}
    </WalletContext.Provider>
  );
};
