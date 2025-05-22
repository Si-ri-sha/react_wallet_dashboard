import React from "react";
import { useWallet } from "../hooks/useWallet";
import { useTheme } from "../context/ThemeContext";

const WalletCard = () => {
  const { address, network, ethBalance, daiBalance, ensName, connectWallet } = useWallet();
  const { theme, toggleTheme } = useTheme();

  const formatAddress = (addr: string) =>
    addr.slice(0, 6) + "..." + addr.slice(-4);

  return (
    <div className="max-w-md mx-auto mt-10 p-6 rounded-2xl shadow-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-all duration-300">
      <h1 className="text-2xl font-bold mb-6 text-center"> Wallet Dashboard</h1>

      {/* Theme Toggle */}
      <button
        onClick={toggleTheme}
        className="block mx-auto bg-gray-300 dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-600 text-sm px-3 py-1 rounded"
      >
        Switch to {theme === "dark" ? "light" : "dark"} mode
      </button>

      {/* If not connected */}
      {!address ? (
        <button
          onClick={connectWallet}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition"
        >
          Connect Wallet
        </button>
      ) : (
        <>
         {ensName && (
            <div className="text-center text-lg font-medium text-indigo-500">
              {ensName}
            </div>
          )}
          <div className="text-center text-sm text-gray-500">
            {formatAddress(address)}
          </div>
          <div className="text-center text-sm">Network: {network}</div>

          <div className="flex justify-between text-sm border-t pt-4">
            <span>ETH Balance:</span>
            <span>{ethBalance ?? "--"} ETH</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>DAI Balance:</span>
            <span>{daiBalance ?? "--"} DAI</span>
          </div>
        </>
      )}
    </div>
  );
};

export default WalletCard;