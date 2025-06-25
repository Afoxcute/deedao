import React, { useState, useEffect } from "react";
import Button from "../Button";
import NumField from "./NumField";
// Commented out Solana imports
// import * as anchor from "@project-serum/anchor";
// import * as token from "@solana/spl-token";
// import { useWallet } from "@solana/wallet-adapter-react";
// import { clusterApiUrl, LAMPORTS_PER_SOL } from "@solana/web3.js";
// import {
//   getTokenFromType,
//   getMyStakedAndReward,
//   vest,
//   unvest,
//   claim,
//   getTokenBalance,
//   getMyVestedAndReward,
//   showToast,
// } from "../../contracts/TokenVesting/web3_vesting";
// import { useAppKitAccount, useAppKitProvider } from '@reown/appkit/react';
// import { useAppKitConnection } from '@reown/appkit-adapter-solana/react';
// import type { Provider } from '@reown/appkit';
// import { PublicKey } from "@solana/web3.js";
// import { Transaction } from "@solana/web3.js";
// import { SystemProgram } from "@solana/web3.js";

import { useStellarWallet } from "../WalletContextProvider";

const TokenVestingSection = () => {
  const { address, loading } = useStellarWallet();
  const [vestAmount, setVestAmount] = useState("");
  const [unvestAmount, setUnvestAmount] = useState("");
  const [stakedAmount, setStakedAmount] = useState(0);
  const [rewardAmount, setRewardAmount] = useState(0);
  const [tokenBalance, setTokenBalance] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  // Commented out Solana connection setup
  // const SOLANA_HOST = "https://mainnet.helius-rpc.com/?api-key=ad83cc9c-52a4-4ad4-8b6e-d96fd392c9d5";
  // const connection = new anchor.web3.Connection(SOLANA_HOST);

  useEffect(() => {
    if (address) {
      // TODO: Implement Stellar balance and staking info fetching
      console.log("Stellar wallet connected:", address);
      setTokenBalance(1000); // Placeholder
      setStakedAmount(500); // Placeholder
      setRewardAmount(25); // Placeholder
    }
  }, [address]);

  const handleVest = async () => {
    if (!address) {
      console.log("Please connect your Stellar wallet");
      return;
    }

    if (!vestAmount || parseFloat(vestAmount) <= 0) {
      console.log("Please enter a valid amount");
      return;
    }

    setIsLoading(true);
    try {
      // TODO: Implement Stellar vesting
      console.log(`Vesting ${vestAmount} XLM on Stellar network`);
      console.log("Stellar vesting feature coming soon");
    } catch (error) {
      console.error("Error vesting tokens:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUnvest = async () => {
    if (!address) {
      console.log("Please connect your Stellar wallet");
      return;
    }

    if (!unvestAmount || parseFloat(unvestAmount) <= 0) {
      console.log("Please enter a valid amount");
      return;
    }

    setIsLoading(true);
    try {
      // TODO: Implement Stellar unvesting
      console.log(`Unvesting ${unvestAmount} XLM on Stellar network`);
      console.log("Stellar unvesting feature coming soon");
    } catch (error) {
      console.error("Error unvesting tokens:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClaim = async () => {
    if (!address) {
      console.log("Please connect your Stellar wallet");
      return;
    }

    setIsLoading(true);
    try {
      // TODO: Implement Stellar reward claiming
      console.log("Claiming rewards on Stellar network");
      console.log("Stellar reward claiming feature coming soon");
    } catch (error) {
      console.error("Error claiming rewards:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-lightBrown rounded-xl p-6 shadow-custom">
      <h1 className="text-2xl font-semibold dark:text-white text-title-light mb-6">
        Stellar Vesting
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Vest Section */}
        <div className="space-y-4">
          <h2 className="text-lg font-medium dark:text-white text-title-light">
            Vest Tokens
          </h2>

          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="dark:text-subtitle-dark text-subtitle-light">
                Available Balance:
              </span>
              <span className="font-medium dark:text-white text-title-light">
                {tokenBalance} XLM
              </span>
            </div>

            <NumField
              label="Amount to Vest"
              value={vestAmount}
              onChange={setVestAmount}
              placeholder="Enter amount"
              max={tokenBalance}
            />

            <Button
              text={isLoading ? "Vesting..." : "Vest Tokens"}
              onClick={handleVest}
              disabled={isLoading || !address || !vestAmount}
            />
          </div>
        </div>

        {/* Unvest Section */}
        <div className="space-y-4">
          <h2 className="text-lg font-medium dark:text-white text-title-light">
            Unvest Tokens
          </h2>

          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="dark:text-subtitle-dark text-subtitle-light">
                Vested Amount:
              </span>
              <span className="font-medium dark:text-white text-title-light">
                {stakedAmount} XLM
              </span>
            </div>

            <NumField
              label="Amount to Unvest"
              value={unvestAmount}
              onChange={setUnvestAmount}
              placeholder="Enter amount"
              max={stakedAmount}
            />

            <Button
              text={isLoading ? "Unvesting..." : "Unvest Tokens"}
              onClick={handleUnvest}
              disabled={isLoading || !address || !unvestAmount}
            />
          </div>
        </div>

        {/* Rewards Section */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-lg font-medium dark:text-white text-title-light">
            Rewards
          </h2>

          <div className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div>
              <div className="text-sm dark:text-subtitle-dark text-subtitle-light">
                Claimable Rewards
              </div>
              <div className="text-xl font-semibold dark:text-white text-title-light">
                {rewardAmount} XLM
              </div>
            </div>

            <Button
              text={isLoading ? "Claiming..." : "Claim Rewards"}
              onClick={handleClaim}
              disabled={isLoading || !address || rewardAmount === 0}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TokenVestingSection;
