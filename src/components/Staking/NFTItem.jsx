import React, { useState } from "react";
import Button from "../Button";
import { useStellarWallet } from "../WalletContextProvider";
// Commented out Solana imports
// import { useWallet } from "@solana/wallet-adapter-react";
// import * as anchor from "@project-serum/anchor";
// import {
//   clusterApiUrl,
//   Connection,
//   PublicKey,
//   LAMPORTS_PER_SOL,
//   SystemProgram,
//   Transaction,
//   sendAndConfirmTransaction,
//   Keypair,
//   TransactionInstruction,
//   SYSVAR_RENT_PUBKEY,
//   AccountMeta,
//   TransactionMessage,
//   VersionedTransaction,
// } from "@solana/web3.js";
// import { unstakeNFT } from "../../contracts/NFTstaking/nft-staking";

const NFTItem = ({ nft }) => {
  const { address, loading } = useStellarWallet();
  const [isUnstaking, setIsUnstaking] = useState(false);

  // Commented out Solana connection
  // const SOLANA_HOST = clusterApiUrl("mainnet-beta");
  // const connection = new anchor.web3.Connection(SOLANA_HOST);

  const handleUnstake = async () => {
    if (!address) {
      console.log("Please connect your Stellar wallet");
      return;
    }

    setIsUnstaking(true);
    try {
      // TODO: Implement Stellar NFT unstaking
      console.log("Unstaking NFT on Stellar network...");
      // await unstakeNFT(wallet, nft);
      console.log("NFT unstaking feature coming soon for Stellar");
    } catch (error) {
      console.error("Error unstaking NFT:", error);
    } finally {
      setIsUnstaking(false);
    }
  };

  return (
    <div className="bg-white dark:bg-lightBrown rounded-xl p-4 shadow-custom">
      <div className="aspect-square bg-gray-200 dark:bg-gray-700 rounded-lg mb-4 overflow-hidden">
        {nft?.image ? (
          <img
            src={nft.image}
            alt={nft.name || "NFT"}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-500">
            <span>NFT Image</span>
          </div>
        )}
      </div>

      <div className="space-y-2">
        <h3 className="font-semibold dark:text-white text-title-light">
          {nft?.name || "Stellar NFT"}
        </h3>

        <p className="text-sm dark:text-subtitle-dark text-subtitle-light">
          {nft?.description || "Stellar Network NFT"}
        </p>

        <div className="flex justify-between items-center text-sm">
          <span className="dark:text-subtitle-dark text-subtitle-light">
            Staked Rewards:
          </span>
          <span className="font-medium dark:text-white text-title-light">
            {nft?.rewards || "0"} XLM
          </span>
        </div>

        <Button
          text={isUnstaking ? "Unstaking..." : "Unstake NFT"}
          onClick={handleUnstake}
          disabled={isUnstaking || !address}
        />
      </div>
    </div>
  );
};

export default NFTItem;
