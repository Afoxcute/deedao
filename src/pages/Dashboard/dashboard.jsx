import React, { useEffect, useState } from "react";
import DashboardChart from "../../components/Dashboard/DashboardChart";
import DashboardDropdown from "../../components/Dashboard/DashboardDropdown";
import DashboardProgress from "../../components/Dashboard/DashboardProgress";
import DashboardReward from "../../components/Dashboard/DashboardReward";
import StatItem from "../../components/StatItem";
import VestingSchedule from "../../components/VestingSchedule";
import { useStellarWallet } from "../../components/WalletContextProvider";
// import { getMyStakedAndReward } from "../../contracts/tokenstaking/web3";

const Mainboard = () => {
  const { address, loading } = useStellarWallet();
  const [stakeAmount, setStakeAmount] = useState(0);
  const [rewardAmount, setRewardAmount] = useState(0);

  useEffect(() => {
    if (address) {
      // TODO: Replace with Stellar staking contract calls
      // getMyStakedAndReward(wallet).then((data) => {
      //   setStakeAmount(data.stakeAmount);
      //   setRewardAmount(data.rewardAmount);
      // });
      console.log("Connected to Stellar wallet:", address);
    }
  }, [address]);

  return (
    <div className="flex flex-col gap-8 w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        <StatItem
          title="Total Staked"
          value={`${stakeAmount} XLM`}
          icon="/icons/staking.svg"
          iconDark="/icons/staking-light.svg"
        />
        <StatItem
          title="Total Rewards"
          value={`${rewardAmount} XLM`}
          icon="/icons/earning.svg"
          iconDark="/icons/earning-light.svg"
        />
        <StatItem
          title="APR"
          value="12.5%"
          icon="/icons/apr.svg"
          iconDark="/icons/apr-light.svg"
        />
        <StatItem
          title="Duration"
          value="30 Days"
          icon="/icons/total-duration-circle.svg"
          iconDark="/icons/total-duration-circle-light.svg"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <DashboardChart />
        </div>
        <div className="flex flex-col gap-4">
          <DashboardReward />
          <DashboardProgress />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <VestingSchedule />
        <div className="bg-white dark:bg-lightBrown rounded-xl p-6">
          <h3 className="text-lg font-semibold dark:text-white text-title-light mb-4">
            Recent Activity
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
              <span className="text-sm dark:text-subtitle-dark text-subtitle-light">
                Staked 100 XLM
              </span>
              <span className="text-sm text-green-600">+5 XLM</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
              <span className="text-sm dark:text-subtitle-dark text-subtitle-light">
                Claimed Rewards
              </span>
              <span className="text-sm text-blue-600">15 XLM</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-sm dark:text-subtitle-dark text-subtitle-light">
                Unstaked 50 XLM
              </span>
              <span className="text-sm text-red-600">-2.5 XLM</span>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full h-96">
        <iframe
          title="Stellar Network Stats"
          src="https://dashboard.stellar.org/"
          className="w-full h-full rounded-xl border-0"
          style={{ background: 'transparent' }}
        />
      </div>
    </div>
  );
};

export default Mainboard;
