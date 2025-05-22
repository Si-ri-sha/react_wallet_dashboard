import React, { createContext, useState, useEffect, useCallback } from "react";
import { ethers } from "ethers";

interface WalletContextType {
  address: string | null;
  network: string | null;
  ethBalance: string | null;
  daiBalance: string | null;
  connectWallet: () => Promise<void>;
}

export const WalletContext = createContext<WalletContextType>({
  address: null,
  network: null,
  ethBalance: null,
  daiBalance: null,
  connectWallet: async () => {},
});

const DAI_ADDRESS_MAP: Record<string, string> = {
  // Mainnet
  homestead: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
  // Goerli testnet (DAI deployed)
  goerli: "0x11fE4B6AE13d2a6055C8D9cF65c55bac32B5d844",
};

const MINIMAL_ERC20_ABI = [
  "function balanceOf(address owner) view returns (uint256)",
  "function decimals() view returns (uint8)",
];

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [address, setAddress] = useState<string | null>(null);
  const [network, setNetwork] = useState<string | null>(null);
  const [ethBalance, setEthBalance] = useState<string | null>(null);
  const [daiBalance, setDaiBalance] = useState<string | null>(null);

  let blockListener: ((blockNumber: number) => void) | null = null;

  const fetchBalances = useCallback(
    async (provider: ethers.BrowserProvider, addr: string, net: string) => {
      // Fetch ETH balance
      const ethBalanceBN = await provider.getBalance(addr);
      setEthBalance(ethers.formatEther(ethBalanceBN));

      // Fetch DAI balance if contract exists on network
      const daiAddress = DAI_ADDRESS_MAP[net];
      if (!daiAddress) {
        setDaiBalance(null);
        return;
      }

      try {
        const daiContract = new ethers.Contract(daiAddress, MINIMAL_ERC20_ABI, provider);
        const [rawBalance, decimals] = await Promise.all([
          daiContract.balanceOf(addr),
          daiContract.decimals(),
        ]);
        const formatted = ethers.formatUnits(rawBalance, decimals);
        setDaiBalance(formatted);
      } catch {
        setDaiBalance(null);
         }
    },
    []
  );

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

      await fetchBalances(provider, accounts[0], network.name);

      // Remove existing listener if any
      if (blockListener) {
        provider.provider.removeListener("block", blockListener);
      }

      blockListener = async (blockNumber: number) => {
        await fetchBalances(provider, accounts[0], network.name);
      };

      provider.provider.removeListener("block", blockListener);
    } catch (error) {
      console.error("Wallet connection error:", error);
      alert("Failed to connect wallet");
    }
  }, [fetchBalances]);

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
    <WalletContext.Provider value={{ address, network, ethBalance, daiBalance, connectWallet }}>
      {children}
    </WalletContext.Provider>
  );
};