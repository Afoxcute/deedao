import { Box, Typography, useTheme } from '@mui/material';
import { formatDistanceToNow } from 'date-fns';
import Image from 'next/image';
import { NFTStakingPosition } from '../../utils/nft';
import { OpaqueButton } from '../common/OpaqueButton';

interface NFTStakingPositionCardProps {
  position: NFTStakingPosition;
  onUnstake: (tokenId: string) => Promise<void>;
  onClaimRewards: (tokenId: string) => Promise<void>;
  isLoading: boolean;
}

export const NFTStakingPositionCard: React.FC<NFTStakingPositionCardProps> = ({
  position,
  onUnstake,
  onClaimRewards,
  isLoading
}) => {
  const theme = useTheme();
  const rewards = Number(position.stakingRewards) / 1e7;
  const stakedDuration = formatDistanceToNow(position.stakedAt, { addSuffix: true });
  const canUnstake = !position.isLocked;
  const hasRewards = rewards > 0;

  return (
    <Box sx={{
      backgroundColor: theme.palette.background.paper,
      borderRadius: '8px',
      padding: '16px',
      border: `1px solid ${theme.palette.divider}`,
      display: 'flex',
      alignItems: 'center',
      gap: '16px'
    }}>
      {/* NFT Image */}
      <Box sx={{
        width: '80px',
        height: '80px',
        borderRadius: '8px',
        overflow: 'hidden',
        flexShrink: 0,
        position: 'relative'
      }}>
        <Image 
          src={position.metadata?.image || '/icons/tokens/soroban.svg'} 
          alt={position.metadata?.name || 'NFT'}
          fill
          style={{ objectFit: 'cover' }}
        />
      </Box>

      {/* NFT Info */}
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography variant="h4" sx={{ marginBottom: '4px' }}>
          {position.metadata?.name || `NFT #${position.tokenId}`}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ marginBottom: '4px' }}>
          {position.metadata?.collection || 'Unknown Collection'} • {position.metadata?.rarity || 'Unknown'}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Staked {stakedDuration}
        </Typography>
      </Box>

      {/* Rewards */}
      <Box sx={{ textAlign: 'center', minWidth: '120px' }}>
        <Typography variant="h4" color="success.main" sx={{ marginBottom: '4px' }}>
          {rewards.toFixed(2)}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Rewards Earned
        </Typography>
      </Box>

      {/* Status */}
      <Box sx={{ textAlign: 'center', minWidth: '100px' }}>
        <Box sx={{
          display: 'inline-block',
          padding: '4px 8px',
          borderRadius: '4px',
          backgroundColor: position.isLocked ? theme.palette.warning.main : theme.palette.success.main,
          color: 'white',
          fontSize: '12px',
          fontWeight: 'bold'
        }}>
          {position.isLocked ? 'Locked' : 'Unlocked'}
        </Box>
      </Box>

      {/* Actions */}
      <Box sx={{ display: 'flex', gap: 1, flexShrink: 0 }}>
        {hasRewards && (
          <OpaqueButton
            onClick={() => onClaimRewards(position.tokenId)}
            disabled={isLoading}
            palette={theme.palette.success}
            sx={{ 
              backgroundColor: theme.palette.success.main,
              color: 'white',
              '&:hover': {
                backgroundColor: theme.palette.success.dark
              }
            }}
          >
            Claim
          </OpaqueButton>
        )}
        
        <OpaqueButton
          onClick={() => onUnstake(position.tokenId)}
          disabled={isLoading || !canUnstake}
          palette={theme.palette.error}
          sx={{ 
            backgroundColor: canUnstake ? theme.palette.error.main : theme.palette.action.disabled,
            color: 'white',
            '&:hover': {
              backgroundColor: canUnstake ? theme.palette.error.dark : theme.palette.action.disabled
            }
          }}
        >
          Unstake
        </OpaqueButton>
      </Box>
    </Box>
  );
}; 