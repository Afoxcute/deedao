import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import Button from "../../components/Button";
import TextField from "../../components/TextField";
import { useStellarWallet } from "../../components/WalletContextProvider";
// Commented out Solana contract imports for now
// import {
//   getMyStakedAndReward,
//   getTokenFromType,
//   showToast
// } from "../../contracts/tokenstaking/web3";
// import { distributeTokens } from "../../contracts/Tokenomics/web3_tokenomics";
// import {
//   distributeNFTsToWallet,
//   getTokenFromTypeNFT,
// } from "../../contracts/NFTstaking/nft-staking";

const SettingPage = () => {
  const { address, loading } = useStellarWallet();
  const [amount, setAmount] = useState("");
  const [walletAddress, setWalletAddress] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleDistributeTokens = async () => {
    if (!address) {
      toast.error("Please connect your Stellar wallet first");
      return;
    }

    if (!amount || !walletAddress) {
      toast.error("Please fill in all fields");
      return;
    }

    setIsLoading(true);
    try {
      // TODO: Implement Stellar token distribution
      toast.success("Feature coming soon for Stellar network");
      console.log(`Would distribute ${amount} XLM to ${walletAddress}`);
    } catch (error) {
      toast.error("Failed to distribute tokens");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDistributeNFTs = async () => {
    if (!address) {
      toast.error("Please connect your Stellar wallet first");
      return;
    }

    if (!walletAddress) {
      toast.error("Please enter a wallet address");
      return;
    }

    setIsLoading(true);
    try {
      // TODO: Implement Stellar NFT distribution
      toast.success("NFT distribution feature coming soon for Stellar network");
      console.log(`Would distribute NFTs to ${walletAddress}`);
    } catch (error) {
      toast.error("Failed to distribute NFTs");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold dark:text-white text-title-light mb-2">
          Settings
        </h1>
        <p className="dark:text-subtitle-dark text-subtitle-light">
          Manage your Stellar staking platform settings
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Token Distribution Section */}
        <div className="bg-white dark:bg-lightBrown rounded-xl p-6 shadow-custom">
          <h2 className="text-xl font-semibold dark:text-white text-title-light mb-4">
            Distribute Tokens
          </h2>
          <div className="space-y-4">
            <TextField
              label="Amount (XLM)"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount to distribute"
              type="number"
            />
            <TextField
              label="Recipient Wallet Address"
              value={walletAddress}
              onChange={(e) => setWalletAddress(e.target.value)}
              placeholder="Enter Stellar wallet address"
            />
            <Button
              text={isLoading ? "Distributing..." : "Distribute Tokens"}
              onClick={handleDistributeTokens}
              disabled={isLoading || !address}
            />
          </div>
        </div>

        {/* NFT Distribution Section */}
        <div className="bg-white dark:bg-lightBrown rounded-xl p-6 shadow-custom">
          <h2 className="text-xl font-semibold dark:text-white text-title-light mb-4">
            Distribute NFTs
          </h2>
          <div className="space-y-4">
            <TextField
              label="Recipient Wallet Address"
              value={walletAddress}
              onChange={(e) => setWalletAddress(e.target.value)}
              placeholder="Enter Stellar wallet address"
            />
            <Button
              text={isLoading ? "Distributing..." : "Distribute NFTs"}
              onClick={handleDistributeNFTs}
              disabled={isLoading || !address}
            />
          </div>
        </div>

        {/* Wallet Info Section */}
        <div className="lg:col-span-2 bg-white dark:bg-lightBrown rounded-xl p-6 shadow-custom">
          <h2 className="text-xl font-semibold dark:text-white text-title-light mb-4">
            Wallet Information
          </h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
              <span className="dark:text-subtitle-dark text-subtitle-light">
                Status:
              </span>
              <span className={`font-medium ${address ? 'text-green-600' : 'text-red-600'}`}>
                {address ? 'Connected' : 'Not Connected'}
              </span>
            </div>
            {address && (
              <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                <span className="dark:text-subtitle-dark text-subtitle-light">
                  Address:
                </span>
                <span className="font-mono text-sm dark:text-white text-title-light">
                  {address.slice(0, 8)}...{address.slice(-8)}
                </span>
              </div>
            )}
            <div className="flex justify-between items-center py-2">
              <span className="dark:text-subtitle-dark text-subtitle-light">
                Network:
              </span>
              <span className="font-medium dark:text-white text-title-light">
                Stellar Testnet
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingPage;
