import React, { useCallback, useEffect, useMemo, useState } from "react";

// import * as anchor from "@project-serum/anchor";
// import * as token from "@solana/spl-token";
// import { useWallet } from "@solana/wallet-adapter-react";
// import { clusterApiUrl, LAMPORTS_PER_SOL } from "@solana/web3.js";

import { useStellarWallet } from "../WalletContextProvider";

// import { depositReWard, initProject } from "../../contracts/NFTstaking/nft-staking";
// import { SWRD_TOKEN_MINT } from "../../contracts/NFTstaking/constantsNFT";
// import {
//   vestingDepositReWard,
//   vestingInitProject,
// } from "../../contracts/NFTVesting/nft-vesting";
// import { convertToDecimal } from "../../contracts/NFTstaking/nft-staking";
import Button from "../Button";
import TextField from "../TextField";

// const SOLANA_HOST = "https://mainnet.helius-rpc.com/?api-key=ad83cc9c-52a4-4ad4-8b6e-d96fd392c9d5";//"https://api.mainnet-beta.solana.com";//clusterApiUrl("devnet");
// const connection = new anchor.web3.Connection(SOLANA_HOST);

const NFTStaking = ({ setIsCreate }) => {
  const poolEndDateRef = React.useRef(null);
  const { address, loading, connect } = useStellarWallet();

  const [mintAddress, setMintAddress] = useState("");
  const [rewardAmount, setRewardAmount] = useState(0);
  const [rewardPerSecond, setRewardPerSecond] = useState(0);
  const [rewardMaxAmount, setRewardMaxAmount] = useState(0);
  const [maxRewardPerSecond, setMaxRewardPerSecond] = useState(0);
  const [walletBalance, setWalletBalance] = useState(0);

  // const fetchBalance = useCallback(async () => {
  //   try {
  //     const balance1 = await connection.getBalance(wallet.publicKey);
  //     const mint = SWRD_TOKEN_MINT;

  //     const userAta = await token.getOrCreateAssociatedTokenAccount(
  //       connection,
  //       wallet,
  //       mint,
  //       wallet.publicKey,
  //       false
  //     );
  //     const userAta_balance = parseInt(userAta.amount) / LAMPORTS_PER_SOL;
  //     setWalletBalance(userAta_balance);
  //   } catch (error) {
  //     // Handle errors appropriately
  //     console.error("Error fetching balance:", error);
  //   }
  // }, [connection, wallet]);

  // useEffect(() => {
  //   // connectWallet();
  //   fetchBalance();
  // }, [connection, wallet]);

  const onAddPool = async () => {
    // try {
    //   let txHash = await initProject(wallet, connection);
    //   console.log(txHash);
    // } catch (e) {
    //   console.error(e);
    // }
    console.log("Stellar NFT staking pool creation not implemented yet");
  };

  const onDepositReward = async () => {
    // try {
    //   console.log("rewardAmount = ", rewardAmount);
    //   const deposit_amount = convertToDecimal(rewardAmount);
    //   let txHash = await depositReWard(wallet, connection, deposit_amount);
    //   console.log(txHash);
    // } catch (e) {
    //   console.error(e);
    // }
    console.log("Stellar NFT reward deposit not implemented yet");
  };

  const onAddVestingPool = async () => {
    // try {
    //   let txHash = await vestingInitProject(wallet, connection);
    //   console.log(txHash);
    // } catch (e) {
    //   console.error(e);
    // }
    console.log("Stellar NFT vesting pool creation not implemented yet");
  };

  const onVestingDepositReward = async () => {
    // try {
    //   const deposit_amount = convertToDecimal(rewardAmount);
    //   let txHash = await vestingDepositReWard(
    //     wallet,
    //     connection,
    //     deposit_amount
    //   );
    //   console.log(txHash);
    // } catch (e) {
    //   console.error(e);
    // }
    console.log("Stellar NFT vesting reward deposit not implemented yet");
  };

  return (
    <div className="flex flex-col items-center w-full ">
      <div className="flex flex-row items-center w-auto ">
        <div className="flex flex-col w-full gap-5 p-6">
          <div className="flex flex-row w-full gap-4">
            <div className="w-full h-11">
              <Button text="Add NFT Staking Pool" onClick={onAddPool} />
            </div>
          </div>
          <div className="flex gap-3">
            <div className="w-full">
              <TextField
                label="Reward Amount"
                placeholder="0"
                type="number"
                id="reward-amount"
                name="reward-amount"
                onChange={(e) => setRewardAmount(e.target.value)}
              />
            </div>
          </div>
          <div className="w-full my-4 h-11">
            <Button text="Deposit Reward" onClick={onDepositReward} />
          </div>
          <div className="flex gap-3"></div>
        </div>
        <div className="flex flex-col w-full gap-5 p-6">
          <div className="flex flex-row w-full gap-4">
            <div className="w-full h-11">
              <Button text="Add NFT Vesting Pool" onClick={onAddVestingPool} />
            </div>
          </div>
          <div className="flex gap-3">
            <div className="w-full">
              <TextField
                label="Reward Amount"
                placeholder="0"
                type="number"
                id="reward-amount"
                name="reward-amount"
                onChange={(e) => setRewardAmount(e.target.value)}
              />
            </div>
          </div>
          <div className="w-full my-4 h-11">
            <Button text="Deposit Reward" onClick={onVestingDepositReward} />
          </div>
          <div className="flex gap-3"></div>
        </div>
      </div>
      <div className="w-full flex items-center justify-center dark:bg-[#342216] bg-[#AA6C39] p-4 gap-3 shadow-[0px_-5px_30px_rgba(212,_132,_67,_0.25)] ">
        <div className="w-1/2 h-11">
          <Button
            text="Back"
            variant="outline"
            onClick={() => setIsCreate(false)}
          />
        </div>
      </div>
    </div>
  );
};

export default NFTStaking;
