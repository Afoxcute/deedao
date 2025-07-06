import { Box, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Divider } from '../components/common/Divider';
import { OpaqueButton } from '../components/common/OpaqueButton';
import { Row } from '../components/common/Row';
import { useSettings } from '../contexts';
import { useWallet } from '../contexts/wallet';
import { usePoolMeta } from '../hooks/api';
import theme from '../theme';

export default function StakingPage() {
  const router = useRouter();
  const { walletId } = useWallet();
  const { lastPool } = useSettings();
  const [stakedAmount, setStakedAmount] = useState<string>('0');
  const [stakingAPR, setStakingAPR] = useState<string>('0');
  const [rewardsEarned, setRewardsEarned] = useState<string>('0');
  const { data: poolMeta } = usePoolMeta(router.query.poolId as string, !!router.query.poolId);

  useEffect(() => {
    // TODO: Fetch staking data from contract
    if (walletId && poolMeta) {
      // Example data - replace with actual contract calls
      setStakedAmount('1000');
      setStakingAPR('12.5');
      setRewardsEarned('50');
    }
  }, [walletId, poolMeta]);

  const handleStake = () => {
    router.push(`/stake?poolId=${poolMeta?.id}`);
  };

  const handleUnstake = () => {
    router.push(`/unstake?poolId=${poolMeta?.id}`);
  };

  const handleClaimRewards = async () => {
    // TODO: Implement claim rewards functionality
    console.log('Claiming rewards');
  };

  return (
    <Box sx={{ width: '100%', maxWidth: '1200px', margin: '0 auto', padding: '24px' }}>
      <Row sx={{ justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <Typography variant="h1">Staking</Typography>
      </Row>
      <Divider />
      
      <Row sx={{ marginTop: '24px', gap: '24px' }}>
        <Box sx={{ 
          flex: 1, 
          backgroundColor: theme.palette.background.paper,
          padding: '24px',
          borderRadius: '8px'
        }}>
          <Typography variant="h2">Total Staked</Typography>
          <Typography variant="h1" sx={{ color: theme.palette.primary.main }}>
            {stakedAmount} BLND
          </Typography>
        </Box>
        <Box sx={{ 
          flex: 1, 
          backgroundColor: theme.palette.background.paper,
          padding: '24px',
          borderRadius: '8px'
        }}>
          <Typography variant="h2">Staking APR</Typography>
          <Typography variant="h1" sx={{ color: theme.palette.info.main }}>
            {stakingAPR}%
          </Typography>
        </Box>
        <Box sx={{ 
          flex: 1, 
          backgroundColor: theme.palette.background.paper,
          padding: '24px',
          borderRadius: '8px'
        }}>
          <Typography variant="h2">Rewards Earned</Typography>
          <Typography variant="h1" sx={{ color: theme.palette.success.main }}>
            {rewardsEarned} BLND
          </Typography>
        </Box>
      </Row>

      <Row sx={{ marginTop: '24px', gap: '16px', justifyContent: 'center' }}>
        <OpaqueButton
          onClick={handleStake}
          disabled={!walletId}
          palette={theme.palette.primary}
          sx={{ width: '150px' }}
        >
          Stake
        </OpaqueButton>
        <OpaqueButton
          onClick={handleUnstake}
          disabled={!walletId || parseFloat(stakedAmount) <= 0}
          palette={theme.palette.warning}
          sx={{ width: '150px' }}
        >
          Unstake
        </OpaqueButton>
        <OpaqueButton
          onClick={handleClaimRewards}
          disabled={!walletId || parseFloat(rewardsEarned) <= 0}
          palette={theme.palette.success}
          sx={{ width: '150px' }}
        >
          Claim Rewards
        </OpaqueButton>
      </Row>
    </Box>
  );
}
