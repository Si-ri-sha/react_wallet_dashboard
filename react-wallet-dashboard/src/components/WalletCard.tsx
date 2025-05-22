import React from "react";
import { useWallet } from "../hooks/useWallet";
import { useTheme } from "../context/ThemeContext";

const WalletCard: React.FC = () => {
  const { address, network, ethBalance, daiBalance, ensName, connectWallet } = useWallet();
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="max-w-md mx-auto mt-10 p-6 rounded-2xl shadow-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-all duration-300">
      <h1 className="text-2xl font-bold mb-6 text-center"> Wallet Dashboard</h1>

      <div className="flex justify-between items-center mb-4">
        <button
          onClick={toggleTheme}
          className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded hover:scale-105 transition"
        >
          {theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
        </button>

        <button
          onClick={connectWallet}
          className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition disabled:opacity-50"
        >
          {address ? "Connected" : "Connect Wallet"}
        </button>
      </div>

      {address && (
        <div className="space-y-3 mt-6 text-sm">
          <div>
            <span className="font-semibold">Address:</span><br />
            <span className="break-words">{address}</span>
          </div>
          <div>
            <span className="font-semibold">Network:</span> {network}
          </div>
          <div>
            <span className="font-semibold">ETH Balance:</span> {ethBalance} ETH
          </div>
        </div>
      )}

      {!address && (
        <p className="text-sm text-gray-600 dark:text-gray-300 mt-4 text-center">
          Please connect your MetaMask wallet to view info.
        </p>
      )}
    </div>
  );
};

export default WalletCard;