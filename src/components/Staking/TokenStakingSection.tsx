import React, { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
// import { Transaction, SystemProgram, PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js";
// import { useAppKitAccount, useAppKitProvider } from '@reown/appkit/react';
// import { useAppKitConnection } from '@reown/appkit-adapter-solana/react';
// import type { Provider } from '@reown/appkit';

import { useStellarWallet } from "../WalletContextProvider";
import Button from "../Button";
import StatItem from "../StatItem";
import PlusMinusButton from "./PlusMinusButton";
import StakingSummaryItem from "./StakingSummaryItem";

const TokenStakingSection = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [xlmBalance, setXlmBalance] = useState(0);

  const [totalStaking] = useState(250000);
  const [stakeAmount, setStakeAmount] = useState(0);
  const [stakedAmount, setStakedAmount] = useState(0);
  const [totalStaked] = useState(0);
  const [setimatedAward] = useState(150);
  const [price] = useState(0.0001);
  const [rewards, setRewards] = useState(0);
  const [walletBalance, setWalletBalance] = useState(0);
  const [userAta_balance, setUserAta_balance] = useState(0);
  const [isStaking, setIsStaking] = useState(false);
  const [isUnstaking, setIsUnstaking] = useState(false);
  const [isClaiming, setIsClaiming] = useState(false);
  const [stakingStartTime, setStakingStartTime] = useState(0);
  const [lastClaimTime, setLastClaimTime] = useState(0);

  // Constants
  const STAKE_WALLET_ADDRESS = "STELLAR_STAKING_ADDRESS_PLACEHOLDER";
  const APY = 40; // 40% APY
  const MINIMUM_STAKING_PERIOD = 24 * 60 * 60; // 24 hours in seconds
  const CLAIM_COOLDOWN = 24 * 60 * 60; // 24 hours cooldown

  // Use Stellar wallet context
  const { address, loading, connect } = useStellarWallet();

  // Fetch XLM balance (placeholder for now)
  const fetchXlmBalance = useCallback(async () => {
    // if (!address) return;
    // 
    // try {
    //   // TODO: Implement Stellar balance fetching
    //   setXlmBalance(100); // Placeholder
    // } catch (error) {
    //   console.error("Error fetching XLM balance:", error);
    // }
    console.log("Stellar XLM balance fetch not implemented yet");
  }, [address]);

  // Auto-fetch balance
  useEffect(() => {
    fetchXlmBalance();
    const intervalId = setInterval(fetchXlmBalance, 30000);
    return () => clearInterval(intervalId);
  }, [fetchXlmBalance]);

  // Calculate rewards
  useEffect(() => {
    if (stakedAmount <= 0 || stakingStartTime <= 0) {
      setRewards(0);
      return;
    }

    const intervalId = setInterval(() => {
      const currentTime = Math.floor(Date.now() / 1000);
      const timeElapsed = currentTime - stakingStartTime;
      const annualSeconds = 365 * 24 * 3600;
      const rewardAmount = (stakedAmount * APY * timeElapsed) / (100 * annualSeconds);
      setRewards(parseFloat(rewardAmount.toFixed(5)));
    }, 1000);

    return () => clearInterval(intervalId);
  }, [stakedAmount, stakingStartTime]);

  // Utility functions
  const canUnstake = () => {
    const currentTime = Math.floor(Date.now() / 1000);
    return currentTime - stakingStartTime >= MINIMUM_STAKING_PERIOD;
  };

  const canClaim = () => {
    if (rewards <= 0) return false;
    const currentTime = Math.floor(Date.now() / 1000);
    return currentTime - lastClaimTime >= CLAIM_COOLDOWN;
  };

  // Transaction handlers
  const handleStake = async () => {
    if (!address || stakeAmount <= 0) return;

    // try {
    //   setIsStaking(true);
    //   // TODO: Implement Stellar staking transaction
    //   
    //   setStakedAmount((prev) => prev + stakeAmount);
    //   setStakingStartTime(Math.floor(Date.now() / 1000));
    //   await fetchXlmBalance();
    //   setStakeAmount(0);
    //   
    //   alert("Stake successful!");
    // } catch (error) {
    //   console.error("Staking error:", error);
    //   alert("Failed to stake. Please try again.");
    // } finally {
    //   setIsStaking(false);
    // }
    console.log("Stellar staking not implemented yet");
  };

  const handleUnstake = async () => {
    if (!address || stakedAmount <= 0) return;

    if (!canUnstake()) {
      const hoursLeft = Math.ceil((MINIMUM_STAKING_PERIOD - (Math.floor(Date.now() / 1000) - stakingStartTime)) / 3600);
      alert(`Cannot unstake yet. Please wait ${hoursLeft} more hours.`);
      return;
    }

    // try {
    //   setIsUnstaking(true);
    //   // TODO: Implement Stellar unstaking transaction
    //   
    //   setStakedAmount(0);
    //   setStakingStartTime(0);
    //   setRewards(0);
    //   await fetchXlmBalance();
    //   
    //   alert("Unstake successful!");
    // } catch (error) {
    //   console.error("Unstaking error:", error);
    //   alert("Failed to unstake. Please try again.");
    // } finally {
    //   setIsUnstaking(false);
    // }
    console.log("Stellar unstaking not implemented yet");
  };

  const handleClaim = async () => {
    if (!address || rewards <= 0) return;

    if (!canClaim()) {
      const hoursLeft = Math.ceil((CLAIM_COOLDOWN - (Math.floor(Date.now() / 1000) - lastClaimTime)) / 3600);
      alert(`Cannot claim yet. Please wait ${hoursLeft} more hours.`);
      return;
    }

    // try {
    //   setIsClaiming(true);
    //   // TODO: Implement Stellar claim transaction
    //   
    //   setLastClaimTime(Math.floor(Date.now() / 1000));
    //   setRewards(0);
    //   await fetchXlmBalance();
    //   
    //   alert(`Successfully claimed ${rewards.toFixed(5)} XLM!`);
    // } catch (error) {
    //   console.error("Claiming error:", error);
    //   alert("Failed to claim rewards. Please try again.");
    // } finally {
    //   setIsClaiming(false);
    // }
    console.log("Stellar claim not implemented yet");
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
      <div className="w-full flex flex-col gap-3 dark:bg-lightBrown bg-white shadow-custom rounded-xl p-4 dark:text-white text-title-light ">
        <div className="flex flex-row items-center justify-start my-6 dark:text-white text-title-light gap-4">
          <img
            className="w-14 hidden dark:flex"
            alt=""
            src="/icons/logo1.svg"
          />
          <img
            className="w-14 dark:hidden flex"
            alt=""
            src="/icons/logo1-light.svg"
          />
          <h1 className="text-2xl font-semibold">Appkit Staking</h1>
        </div>

        <div className="flex justify-between">
          <div className="w-2/5 flex flex-col gap-6 ">
            <p>Available In Wallet</p>
            <div className="flex flex-row justify-between">
              <p>{xlmBalance}</p>
              <button
                onClick={() => setStakeAmount(xlmBalance)}
                className="underline text-[#FB9037]"
              >
                Max
              </button>
            </div>

            <div className="flex flex-row justify-between items-center gap-x-1">
              <PlusMinusButton
                value="-"
                onClick={() => setStakeAmount((prev) => Math.max(prev - 1, 0))}
                className=""
              />
              <input
                type="number"
                value={stakeAmount}
                min={0}
                onChange={(e) => setStakeAmount(parseInt(e.target.value))}
                className="w-24 grow h-12 text-center bg-transparent rounded border-2 border-[#9D8B70]"
              />
              <PlusMinusButton
                value="+"
                onClick={() => setStakeAmount((prev) => Math.min(prev + 1, totalStaking))}
                className=""
              />
            </div>

            <div className="h-11">
              <Button
                text={isStaking ? "Staking..." : "Stake"}
                onClick={handleStake}
                variant={undefined}
                iconSrc={undefined}
                className={undefined}
                disabled={!address || stakeAmount <= 0 || isStaking}
              />
            </div>
          </div>

          <div className="w-2/5 flex flex-col gap-6 ">
            <p>Total Staked</p>
            <div className="flex flex-row justify-between">
              <p>{stakedAmount}</p>
            </div>

            <div className="h-11">
              <Button
                text={isUnstaking ? "Unstaking..." : "Unstake"}
                disabled={!address || stakedAmount <= 0 || isUnstaking}
                onClick={handleUnstake}
                variant={undefined}
                iconSrc={undefined}
                className={undefined}
              />
            </div>
            {/* <div className="h-11">
              <Button
                text="Compound"
                className="px-10"
                onClick={handleCompound}
                variant={undefined}
                iconSrc={undefined}
                disabled={!isConnected || stakedAmount <= 0}
              />
            </div> */}
          </div>
        </div>

        <div className="flex justify-between items-center ">
          <p>Pending Rewards: {rewards}</p>
          <div className="w-24 h-11">
            <Button
              text={isClaiming ? "Claiming..." : "Claim"}
              iconSrc="/icons/download.svg"
              className="px-10"
              onClick={handleClaim}
              variant={undefined}
              disabled={!address || rewards <= 0 || isClaiming}
            />
          </div>
        </div>
      </div>

      <div className="w-full flex flex-col gap-3">
        <div className="grid lg:grid-cols-2 grid-cols-1 gap-3">
          <div className="w-full">
            <StatItem
              value={`${totalStaking} XLM`}
              title="Total Staking"
              info="/icons/info.svg"
              iconDark={undefined}
              iconLight={undefined}
            />
          </div>
          <div className="w-full">
            <StatItem
              value={`${setimatedAward}% APR`}
              title="Estimated Award"
              info="/icons/info.svg"
              iconDark={undefined}
              iconLight={undefined}
            />
          </div>
        </div>

        <div className="w-full h-full flex flex-col gap-3 dark:bg-lightBrown bg-white shadow-custom rounded-xl p-6 ">
          <h2 className="font-semibold pb-6 dark:text-white text-title-light">
            Staking Summary
          </h2>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
            <StakingSummaryItem title="XLM Price" value={`$${price}`} icon={undefined} info={undefined} />
            <StakingSummaryItem
              title="Daily Rewards"
              value={`$${price}`}
              info={true} icon={undefined} />
            <StakingSummaryItem
              title="Total Supply"
              value={`$${price}`}
              info={true} icon={undefined} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TokenStakingSection;