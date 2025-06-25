import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import DashboardIcon from "../icons/DashboardIcon";
import VestingIcon from "../icons/VestingIcon";
import StakingIcon from "../icons/StakingIcon";
import StakePoolIcon from "../icons/StakePoolIcon";
import SettingsIcon from "../icons/SettingsIcon";
import ThemeToggleBtn from "./ThemeToggle";
import { useStellarWallet } from "./WalletContextProvider";

const SliderBar = () => {
  const location = useLocation();
  const { address, loading } = useStellarWallet();
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    const fetchBalance = async () => {
      if (address) {
        try {
          // TODO: Implement Stellar balance fetching
          // For now, just set a placeholder balance
          setBalance(0);
          console.log("Stellar wallet connected:", address);
        } catch (error) {
          console.error("Error fetching balance:", error);
        }
      }
    };

    fetchBalance();
  }, [address]);

  return (
    <div className="bg-secondary-bg dark:bg-secondary-dark-bg text-white min-h-screen w-64 flex flex-col">
      {/* Logo Section */}
      <div className="p-6 border-b border-gray-700">
        <Link to="/dashboard" className="flex items-center gap-3">
          <img
            className="w-12 h-12 hidden dark:flex"
            src="/icons/Logo.svg"
            alt="Logo"
          />
          <img
            className="w-12 h-12 dark:hidden flex"
            src="/icons/logo-light.svg"
            alt="Logo"
          />
          <span className="text-xl font-bold">Stellar Staking</span>
        </Link>
      </div>

      {/* Wallet Info */}
      <div className="p-6 border-b border-gray-700">
        <div className="text-sm text-gray-400 mb-2">Wallet Balance</div>
        <div className="text-lg font-semibold">
          {address ? `${balance} XLM` : "Not Connected"}
        </div>
        {address && (
          <div className="text-xs text-gray-400 mt-1">
            {address.slice(0, 8)}...{address.slice(-8)}
          </div>
        )}
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 p-4">
        <div className="space-y-2">
          <Link
            to="/dashboard"
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${location.pathname === "/dashboard"
                ? "bg-[#CD8143]/20 text-[#CD8143]"
                : "hover:bg-gray-700"
              }`}
          >
            <DashboardIcon isActive={location.pathname === "/dashboard"} />
            <span>Dashboard</span>
          </Link>

          <Link
            to="/vesting"
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${location.pathname === "/vesting"
                ? "bg-[#CD8143]/20 text-[#CD8143]"
                : "hover:bg-gray-700"
              }`}
          >
            <VestingIcon isActive={location.pathname === "/vesting"} />
            <span>Vesting</span>
          </Link>

          <Link
            to="/staking"
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${location.pathname === "/staking"
                ? "bg-[#CD8143]/20 text-[#CD8143]"
                : "hover:bg-gray-700"
              }`}
          >
            <StakingIcon isActive={location.pathname === "/staking"} />
            <span>Staking</span>
          </Link>

          <Link
            to="/poolcreation"
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${location.pathname === "/poolcreation"
                ? "bg-[#CD8143]/20 text-[#CD8143]"
                : "hover:bg-gray-700"
              }`}
          >
            <StakePoolIcon isActive={location.pathname === "/poolcreation"} />
            <span>Pool Creation</span>
          </Link>

          <Link
            to="/setting"
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${location.pathname === "/setting"
                ? "bg-[#CD8143]/20 text-[#CD8143]"
                : "hover:bg-gray-700"
              }`}
          >
            <SettingsIcon isActive={location.pathname === "/setting"} />
            <span>Settings</span>
          </Link>
        </div>
      </nav>

      {/* Theme Toggle */}
      <div className="p-4 border-t border-gray-700">
        <ThemeToggleBtn />
      </div>
    </div>
  );
};

export default SliderBar;
