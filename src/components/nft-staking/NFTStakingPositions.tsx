import { Box, Typography, useTheme } from '@mui/material';
import { useState } from 'react';
import { NFTStakingPosition } from '../../utils/nft';
import { AnvilAlert } from '../common/AnvilAlert';
import { NFTStakingPositionCard } from './NFTStakingPositionCard';

interface NFTStakingPositionsProps {
  poolId: string;
}

export const NFTStakingPositions: React.FC<NFTStakingPositionsProps> = ({ poolId }) => {
  const theme = useTheme();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Mock staking positions - in a real implementation, this would come from the blockchain
  const [stakingPositions, setStakingPositions] = useState<NFTStakingPosition[]>([
    {
      tokenId: '1',
      stakedAt: Date.now() - 30 * 24 * 60 * 60 * 1000, // 30 days ago
      stakingRewards: BigInt(5000000), // 0.5 tokens (7 decimals)
      lockPeriod: 7 * 24 * 60 * 60 * 1000, // 7 days
      isLocked: false,
      metadata: {
        id: '1',
        name: 'Blend Punk #001',
        description: 'A rare Blend Punk NFT',
        image: '/icons/tokens/soroban.svg',
        collection: 'Blend Punks',
        rarity: 'Legendary'
      }
    },
    {
      tokenId: '2',
      stakedAt: Date.now() - 7 * 24 * 60 * 60 * 1000, // 7 days ago
      stakingRewards: BigInt(2000000), // 0.2 tokens (7 decimals)
      lockPeriod: 7 * 24 * 60 * 60 * 1000, // 7 days
      isLocked: true,
      metadata: {
        id: '2',
        name: 'Blend Punk #002',
        description: 'Another Blend Punk NFT',
        image: '/icons/tokens/soroban.svg',
        collection: 'Blend Punks',
        rarity: 'Epic'
      }
    }
  ]);

  const handleUnstake = async (tokenId: string) => {
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // In a real implementation, this would call the blockchain to unstake
      console.log('Unstaking NFT:', tokenId);
      
      // Simulate blockchain delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Remove from staking positions
      setStakingPositions(prev => prev.filter(pos => pos.tokenId !== tokenId));
      
      setSuccess('NFT unstaked successfully!');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to unstake NFT');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClaimRewards = async (tokenId: string) => {
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // In a real implementation, this would call the blockchain to claim rewards
      console.log('Claiming rewards for NFT:', tokenId);
      
      // Simulate blockchain delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Reset rewards for this position
      setStakingPositions(prev => prev.map(pos => 
        pos.tokenId === tokenId 
          ? { ...pos, stakingRewards: BigInt(0) }
          : pos
      ));
      
      setSuccess('Rewards claimed successfully!');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to claim rewards');
    } finally {
      setIsLoading(false);
    }
  };

  const totalRewards = stakingPositions.reduce(
    (sum, position) => sum + position.stakingRewards, 
    BigInt(0)
  );

  const totalStaked = stakingPositions.length;

  if (stakingPositions.length === 0) {
    return (
      <Box sx={{ 
        backgroundColor: theme.palette.background.paper,
        padding: '24px',
        borderRadius: '8px',
        textAlign: 'center'
      }}>
        <Typography variant="h3" sx={{ marginBottom: '8px' }}>
          No Staked NFTs
        </Typography>
        <Typography variant="body1" color="text.secondary">
          You haven&apos;t staked any NFTs yet. Browse available collections to start staking!
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '24px' 
      }}>
        <Typography variant="h2">Your Staking Positions</Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h4" color="primary.main">
              {totalStaked}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              NFTs Staked
            </Typography>
          </Box>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h4" color="success.main">
              {(Number(totalRewards) / 1e7).toFixed(2)}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Total Rewards
            </Typography>
          </Box>
        </Box>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {stakingPositions.map((position) => (
          <NFTStakingPositionCard
            key={position.tokenId}
            position={position}
            onUnstake={handleUnstake}
            onClaimRewards={handleClaimRewards}
            isLoading={isLoading}
          />
        ))}
      </Box>

      {error && (
        <AnvilAlert 
          severity="error" 
          message={error} 
        />
      )}
      {success && (
        <AnvilAlert 
          severity="success" 
          message={success} 
        />
      )}
    </Box>
  );
}; 