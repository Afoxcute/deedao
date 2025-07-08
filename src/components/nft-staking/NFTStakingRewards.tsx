import { Box, LinearProgress, Typography, useTheme } from '@mui/material';
import { useEffect, useState } from 'react';

interface NFTStakingRewardsProps {
  poolId: string;
}

interface RewardData {
  date: string;
  rewards: number;
  apr: number;
}

export const NFTStakingRewards: React.FC<NFTStakingRewardsProps> = ({ poolId }) => {
  const theme = useTheme();
  const [currentRewards, setCurrentRewards] = useState(0);
  const [totalRewards, setTotalRewards] = useState(0);
  const [currentAPR, setCurrentAPR] = useState(15.5);
  const [rewardHistory, setRewardHistory] = useState<RewardData[]>([]);

  // Mock data - in a real implementation, this would come from the blockchain
  useEffect(() => {
    // Simulate fetching reward data
    setCurrentRewards(125.50);
    setTotalRewards(1875.25);
    setCurrentAPR(15.5);

    // Mock historical data
    const history: RewardData[] = [];
    const now = new Date();
    for (let i = 30; i >= 0; i--) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      history.push({
        date: date.toISOString().split('T')[0],
        rewards: Math.random() * 10 + 2, // Random rewards between 2-12
        apr: 15.5 + (Math.random() - 0.5) * 2 // APR variation
      });
    }
    setRewardHistory(history);
  }, [poolId]);

  const weeklyRewards = rewardHistory.slice(-7).reduce((sum, day) => sum + day.rewards, 0);
  const monthlyRewards = rewardHistory.reduce((sum, day) => sum + day.rewards, 0);
  const averageAPR = rewardHistory.reduce((sum, day) => sum + day.apr, 0) / rewardHistory.length;

  return (
    <Box sx={{
      backgroundColor: theme.palette.background.paper,
      borderRadius: '8px',
      padding: '24px',
      border: `1px solid ${theme.palette.divider}`,
      marginBottom: '24px'
    }}>
      <Typography variant="h3" sx={{ marginBottom: '24px' }}>
        Staking Rewards & Analytics
      </Typography>

      {/* Current Rewards Overview */}
      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: { xs: '1fr', md: 'repeat(4, 1fr)' },
        gap: 3,
        marginBottom: '32px'
      }}>
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h4" color="success.main" sx={{ marginBottom: '4px' }}>
            ${currentRewards.toFixed(2)}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Current Rewards
          </Typography>
        </Box>

        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h4" color="primary.main" sx={{ marginBottom: '4px' }}>
            ${totalRewards.toFixed(2)}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Total Rewards Earned
          </Typography>
        </Box>

        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h4" color="warning.main" sx={{ marginBottom: '4px' }}>
            {currentAPR.toFixed(1)}%
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Current APR
          </Typography>
        </Box>

        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h4" color="info.main" sx={{ marginBottom: '4px' }}>
            {averageAPR.toFixed(1)}%
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Average APR (30d)
          </Typography>
        </Box>
      </Box>

      {/* Weekly/Monthly Breakdown */}
      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
        gap: 3,
        marginBottom: '32px'
      }}>
        <Box sx={{ 
          backgroundColor: theme.palette.action.hover,
          padding: '20px',
          borderRadius: '8px'
        }}>
          <Typography variant="h5" sx={{ marginBottom: '12px' }}>
            This Week
          </Typography>
          <Typography variant="h4" color="success.main" sx={{ marginBottom: '8px' }}>
            ${weeklyRewards.toFixed(2)}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Rewards earned in the last 7 days
          </Typography>
        </Box>

        <Box sx={{ 
          backgroundColor: theme.palette.action.hover,
          padding: '20px',
          borderRadius: '8px'
        }}>
          <Typography variant="h5" sx={{ marginBottom: '12px' }}>
            This Month
          </Typography>
          <Typography variant="h4" color="primary.main" sx={{ marginBottom: '8px' }}>
            ${monthlyRewards.toFixed(2)}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Rewards earned in the last 30 days
          </Typography>
        </Box>
      </Box>

      {/* APR Progress */}
      <Box sx={{ marginBottom: '32px' }}>
        <Typography variant="h5" sx={{ marginBottom: '16px' }}>
          APR Performance
        </Typography>
        <Box sx={{ marginBottom: '8px' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
            <Typography variant="body2">Current APR</Typography>
            <Typography variant="body2" fontWeight="bold">
              {currentAPR.toFixed(1)}%
            </Typography>
          </Box>
          <LinearProgress 
            variant="determinate" 
            value={(currentAPR / 20) * 100} // Assuming max APR is 20%
            sx={{ 
              height: 8, 
              borderRadius: 4,
              backgroundColor: theme.palette.action.hover,
              '& .MuiLinearProgress-bar': {
                backgroundColor: theme.palette.success.main
              }
            }}
          />
        </Box>
        <Typography variant="caption" color="text.secondary">
          Target: 20% APR • Current: {currentAPR.toFixed(1)}% • Gap: {(20 - currentAPR).toFixed(1)}%
        </Typography>
      </Box>

      {/* Recent Activity */}
      <Box>
        <Typography variant="h5" sx={{ marginBottom: '16px' }}>
          Recent Reward Activity
        </Typography>
        <Box sx={{ maxHeight: '200px', overflow: 'auto' }}>
          {rewardHistory.slice(-10).reverse().map((day, index) => (
            <Box 
              key={index}
              sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                padding: '8px 0',
                borderBottom: index < 9 ? `1px solid ${theme.palette.divider}` : 'none'
              }}
            >
              <Typography variant="body2">
                {new Date(day.date).toLocaleDateString()}
              </Typography>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Typography variant="body2" color="success.main">
                  +${day.rewards.toFixed(2)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {day.apr.toFixed(1)}% APR
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
}; 