import React, { createContext, useContext, useState, useMemo } from "react";
import {
  StellarWalletsKit,
  WalletNetwork,
  allowAllModules,
  XBULL_ID,
  ISupportedWallet
} from "@creit.tech/stellar-wallets-kit";

// Types for Stellar wallet context
interface StellarWalletContextType {
  address: string | null;
  loading: boolean;
  error: string | null;
  connect: () => Promise<void>;
  disconnect: () => void;
}

// Context for Stellar wallet
const StellarWalletContext = createContext<StellarWalletContextType>({
  address: null,
  loading: false,
  error: null,
  connect: async () => {},
  disconnect: () => {},
});

export const WalletContextProvider = ({ children }) => {
  const [address, setAddress] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [kit] = useState(() =>
    new StellarWalletsKit({
      network: WalletNetwork.TESTNET, // Change to MAINNET if needed
      selectedWalletId: XBULL_ID,
      modules: allowAllModules(),
    })
  );

  const connect = async () => {
    setLoading(true);
    setError(null);
    try {
      await kit.openModal({
        modalTitle: "Connect your Stellar wallet",
        onWalletSelected: async (option) => {
          try {
            await kit.setWallet(option.id);
            const { address } = await kit.getAddress();
            setAddress(address);
          } catch (e) {
            setError(e?.message || "Failed to get address");
          } finally {
            setLoading(false);
          }
        },
        onClosed: (err) => {
          setLoading(false);
          if (err) setError(err.message);
        },
      });
    } catch (e) {
      setError(e?.message || "Failed to open wallet modal");
      setLoading(false);
    }
  };

  const disconnect = () => {
    setAddress(null);
    kit.disconnect && kit.disconnect();
  };

  const value = useMemo(
    () => ({ address, loading, error, connect, disconnect }),
    [address, loading, error]
  );

  return (
    <StellarWalletContext.Provider value={value}>
      {children}
    </StellarWalletContext.Provider>
  );
};

export const useStellarWallet = () => useContext(StellarWalletContext);

export const ConnectWalletButton = () => {
  const { address, loading, error, connect } = useStellarWallet();
  return (
    <div>
      {address ? (
        <span className="px-5 py-2 rounded bg-green-600 text-white font-semibold shadow">
          Connected: {address.slice(0, 6)}...{address.slice(-4)}
        </span>
      ) : (
        <button
          className="px-5 py-2 rounded bg-blue-600 text-white font-semibold shadow hover:bg-blue-700 transition-colors"
          onClick={connect}
          disabled={loading}
        >
          {loading ? "Connecting..." : "Connect Wallet"}
        </button>
      )}
      {error && <div className="text-red-600 text-xs mt-2">{error}</div>}
    </div>
  );
};

export default WalletContextProvider;