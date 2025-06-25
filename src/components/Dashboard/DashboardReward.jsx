import React from "react";
import Button from "../Button";
import { useStellarWallet } from "../WalletContextProvider";

const DashboardReward = () => {
  const { address, loading, connect } = useStellarWallet();

  return (
    <div className="w-full rounded-xl dark:bg-lightBrown bg-white overflow-hidden p-4 shadow-custom">
      <div className="flex flex-col items-center gap-14 ">
        <div className="flex flex-col items-center justify-start gap-2">
          <img className="w-12 hidden dark:flex" alt="" src="/icons/logo1.svg" />
          <img className="w-12 dark:hidden flex" alt="" src="/icons/logo1-light.svg" />
          <div className="text-lg font-semibold dark:text-white text-title-light">
            My Rewards
          </div>
          {address ? (
            <div className="text-xs text-green-600 dark:text-green-400 mt-1">
              Connected: {address.slice(0, 6)}...{address.slice(-4)}
            </div>
          ) : (
            <button
              className="mt-2 px-3 py-1 rounded bg-blue-600 text-white text-xs font-semibold shadow hover:bg-blue-700 transition-colors"
              onClick={connect}
              disabled={loading}
            >
              {loading ? "Connecting..." : "Connect Wallet"}
            </button>
          )}
        </div>

        <div className="flex flex-col items-center justify-center gap-2">
          <div className="text-xs dark:text-subtitle-dark text-subtitle-light">
            Unclaimed Rewards
          </div>
          <div className="flex flex-row items-center justify-start text-lg text-darkorange">
            <div className="font-semibold text-[#FB9037]">200 XLM</div>
          </div>
        </div>
        <div className="w-full flex flex-col items-center gap-2">
          <div className="dark:text-subtitle-dark text-subtitle-light text-xs">
            Total claimed Rewards:1000 XLM
          </div>
          <div className="bg-darkorange" />
          <div className="w-full h-11 text-base rounded-lg font-semibold">
            <Button text="Claim Rewards" disabled={!address} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardReward;
