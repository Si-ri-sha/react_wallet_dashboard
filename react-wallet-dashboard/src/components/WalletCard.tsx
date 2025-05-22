import React from "react";
import { useWallet } from "../hooks/useWallet";
import { useTheme } from "../context/ThemeContext";

const WalletCard: React.FC = () => {
  const { address, network, ethBalance, daiBalance, ensName, connectWallet } = useWallet();
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="bg-white dark:bg-gray-800 shadow-lg rounded-2xl p-6 w-full max-w-md mx-auto mt-10">
      <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Wallet Dashboard</h2>

      <button
        onClick={toggleTheme}
        className="mb-4 px-3 py-1 rounded bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition"
        aria-label="Toggle dark/light mode"
      >
        {theme === "light" ? "Switch to Dark Mode" : "Switch to Light Mode"}
      </button>

      {address ? (
        <div className="text-gray-800 dark:text-gray-200">
          <p><strong>Address:</strong> {ensName ?? address}</p>
          <p><strong>Network:</strong> {network}</p>
          <p><strong>ETH Balance:</strong> {ethBalance ?? "Loading..."}</p>
           <p><strong>DAI Balance:</strong> {daiBalance ?? "N/A"}</p>
        </div>
      ) : (
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          onClick={connectWallet}
        >
          Connect Wallet
        </button>
      )}
    </div>
  );
};

export default WalletCard;
