import { useContext } from "react";
import { WalletContext } from "../context/Walletprovider";

export const useWallet = () => useContext(WalletContext);
