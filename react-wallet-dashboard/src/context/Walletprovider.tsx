import React, {
  createContext,
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";
import { ethers } from "ethers";

interface WalletContextType {
  address: string | null;
  network: string | null;
  ethBalance: string | null;
  daiBalance: string | null;
  ensName: string | null;
  connectWallet: () => Promise<void>;
}

export const WalletContext = createContext<WalletContextType>({
  address: null,
  network: null,
  ethBalance: null,
  daiBalance: null,
  ensName: null,
  connectWallet: async () => {},
});

const DAI_ADDRESS_MAP: Record<string, string> = {
  homestead: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
  goerli: "0x11fE4B6AE13d2a6055C8D9cF65c55bac32B5d844",
};

const MINIMAL_ERC20_ABI = [
  "function balanceOf(address owner) view returns (uint256)",
  "function decimals() view returns (uint8)",
];

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [address, setAddress] = useState<string | null>(null);
  const [network, setNetwork] = useState<string | null>(null);
  const [ethBalance, setEthBalance] = useState<string | null>(null);
  const [daiBalance, setDaiBalance] = useState<string | null>(null);
  const [ensName, setEnsName] = useState<string | null>(null);

  const providerRef = useRef<ethers.BrowserProvider | null>(null);
  const blockListenerRef = useRef<((blockNumber: number) => void) | null>(null);

  const fetchBalances = useCallback(
    async (provider: ethers.BrowserProvider, addr: string, net: string) => {
      const ethBalanceBN = await provider.getBalance(addr);
      setEthBalance(ethers.formatEther(ethBalanceBN));

      const daiAddress = DAI_ADDRESS_MAP[net];
      if (!daiAddress) return setDaiBalance(null);

      try {
        const daiContract = new ethers.Contract(
          daiAddress,
          MINIMAL_ERC20_ABI,
          provider
        );
        const [rawBalance, decimals] = await Promise.all([
          daiContract.balanceOf(addr),
          daiContract.decimals(),
        ]);
        setDaiBalance(ethers.formatUnits(rawBalance, decimals));
      } catch {
        setDaiBalance(null);
      }
    },
    []
  );

  const resolveENS = useCallback(
    async (provider: ethers.BrowserProvider, addr: string) => {
      try {
        const name = await provider.lookupAddress(addr);
        setEnsName(name);
      } catch {
        setEnsName(null);
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
      providerRef.current = provider;

      const accounts = await provider.send("eth_requestAccounts", []);
      const net = await provider.getNetwork();
      const userAddress = accounts[0];

      setAddress(userAddress);
      setNetwork(net.name);

      await fetchBalances(provider, userAddress, net.name);
      await resolveENS(provider, userAddress);

      if (blockListenerRef.current) {
        provider.provider.removeListener("block", blockListenerRef.current);
      }

      const listener = async (blockNumber: number) => {
        await fetchBalances(provider, userAddress, net.name);
        await resolveENS(provider, userAddress);
      };

      provider.provider.on("block", listener);
      blockListenerRef.current = listener;
    } catch (error) {
      console.error("Wallet connection error:", error);
      alert("Failed to connect wallet");
    }
  }, [fetchBalances, resolveENS]);

  useEffect(() => {
    return () => {
      const provider = providerRef.current;
      const listener = blockListenerRef.current;
      if (provider && listener) {
        provider.provider.removeListener("block", listener);
      }
    };
  }, []);

  return (
    <WalletContext.Provider
      value={{
        address,
        network,
        ethBalance,
        daiBalance,
        ensName,
        connectWallet,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};
