
import React from "react";
import { useWallet } from "../hooks/useWallet";

const WalletCard: React.FC = () => {
  const { address, network, ethBalance, daiBalance, ensName, connectWallet } = useWallet();

  return (
    <div className="bg-white dark:bg-gray-800 shadow-lg rounded-2xl p-6 w-full max-w-md mx-auto mt-10">
      <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Wallet Dashboard</h2>

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
