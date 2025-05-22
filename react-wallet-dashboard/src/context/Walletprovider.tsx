import React, { createContext, useState, useEffect, useCallback } from "react";
import { ethers } from "ethers";

interface WalletContextType {
  address: string | null;
  network: string | null;
  ethBalance: string | null;
  connectWallet: () => Promise<void>;
}

export const WalletContext = createContext<WalletContextType>({
  address: null,
  network: null,
  ethBalance: null,
  connectWallet: async () => {},
});

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [address, setAddress] = useState<string | null>(null);
  const [network, setNetwork] = useState<string | null>(null);
  const [ethBalance, setEthBalance] = useState<string | null>(null);

  let blockListener: ((blockNumber: number) => void) | null = null;

  const connectWallet = useCallback(async () => {
    if (!window.ethereum) {
      alert("MetaMask is required.");
      return;
    }

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.send("eth_requestAccounts", []);
      const network = await provider.getNetwork();
      
      setAddress(accounts[0]);
      setNetwork(network.name);

      // Initial balance fetch
      const balanceBigInt = await provider.getBalance(accounts[0]);
      setEthBalance(ethers.formatEther(balanceBigInt));

      if(blockListener){
      provider.provider.removeListener("block", blockListener);
      }

      // Define and save listener function
      blockListener = async (blockNumber: number) => {
        if (!accounts[0]) return;
        const balance = await provider.getBalance(accounts[0]);
        setEthBalance(ethers.formatEther(balance));
      };

      provider.provider.on("block", blockListener);
    } catch (error) {
      console.error("Wallet connection error:", error);
      alert("Failed to connect wallet");
    }
  }, []);

useEffect(() => {
    return () => {
      if (window.ethereum) {
        const provider = new ethers.BrowserProvider(window.ethereum);
        if (blockListener) {
          provider.provider.removeListener("block", blockListener);
        }
      }
    };
  }, []);

  return (
    <WalletContext.Provider value={{ address, network, ethBalance, connectWallet }}>
      {children}
    </WalletContext.Provider>
  );
};