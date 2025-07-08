import { Box, FormControl, InputLabel, MenuItem, Select, Typography, useTheme } from '@mui/material';
import Image from 'next/image';
import { useState } from 'react';
import { NFTMetadata } from '../../utils/nft';
import { AnvilAlert } from '../common/AnvilAlert';
import { OpaqueButton } from '../common/OpaqueButton';

interface NFTStakingFormProps {
  nft: NFTMetadata;
  onStake: (tokenId: string, lockPeriod: number) => Promise<void>;
  onCancel: () => void;
}

const LOCK_PERIODS = [
  { value: 0, label: 'No Lock', description: 'Stake without lock period' },
  { value: 7 * 24 * 60 * 60 * 1000, label: '7 Days', description: 'Lock for 7 days, +10% APR' },
  { value: 30 * 24 * 60 * 60 * 1000, label: '30 Days', description: 'Lock for 30 days, +25% APR' },
  { value: 90 * 24 * 60 * 60 * 1000, label: '90 Days', description: 'Lock for 90 days, +50% APR' }
];

export const NFTStakingForm: React.FC<NFTStakingFormProps> = ({
  nft,
  onStake,
  onCancel
}) => {
  const theme = useTheme();
  const [lockPeriod, setLockPeriod] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleStake = async () => {
    setIsLoading(true);
    setError(null);

    try {
      await onStake(nft.id, lockPeriod);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to stake NFT');
    } finally {
      setIsLoading(false);
    }
  };

  const selectedPeriod = LOCK_PERIODS.find(p => p.value === lockPeriod);
  const baseAPR = 12.5; // Base APR for NFT staking
  const bonusAPR = lockPeriod > 0 ? (lockPeriod === 7 * 24 * 60 * 60 * 1000 ? 10 : 
                                     lockPeriod === 30 * 24 * 60 * 60 * 1000 ? 25 : 50) : 0;
  const totalAPR = baseAPR + bonusAPR;

  return (
    <Box sx={{
      backgroundColor: theme.palette.background.paper,
      borderRadius: '8px',
      padding: '24px',
      border: `1px solid ${theme.palette.divider}`,
      maxWidth: '500px',
      margin: '0 auto'
    }}>
      <Typography variant="h3" sx={{ marginBottom: '16px', textAlign: 'center' }}>
        Stake NFT
      </Typography>

      {/* NFT Display */}
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '16px', 
        marginBottom: '24px',
        padding: '16px',
        backgroundColor: theme.palette.action.hover,
        borderRadius: '8px'
      }}>
        <Box sx={{
          width: '80px',
          height: '80px',
          borderRadius: '8px',
          overflow: 'hidden',
          flexShrink: 0,
          position: 'relative'
        }}>
          <Image 
            src={nft.image || '/icons/tokens/soroban.svg'}
            alt={nft.name}
            fill
            style={{ objectFit: 'cover' }}
          />
        </Box>
        <Box>
          <Typography variant="h4" sx={{ marginBottom: '4px' }}>
            {nft.name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {nft.collection} • {nft.rarity}
          </Typography>
        </Box>
      </Box>

      {/* Lock Period Selection */}
      <FormControl fullWidth sx={{ marginBottom: '24px' }}>
        <InputLabel>Lock Period</InputLabel>
        <Select
          value={lockPeriod}
          label="Lock Period"
          onChange={(e) => setLockPeriod(e.target.value as number)}
        >
          {LOCK_PERIODS.map((period) => (
            <MenuItem key={period.value} value={period.value}>
              <Box>
                <Typography variant="body1">{period.label}</Typography>
                <Typography variant="caption" color="text.secondary">
                  {period.description}
                </Typography>
              </Box>
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* APR Display */}
      <Box sx={{ 
        backgroundColor: theme.palette.primary.main,
        color: 'white',
        padding: '16px',
        borderRadius: '8px',
        textAlign: 'center',
        marginBottom: '24px'
      }}>
        <Typography variant="h3" sx={{ marginBottom: '4px' }}>
          {totalAPR.toFixed(1)}% APR
        </Typography>
        <Typography variant="body2">
          {baseAPR}% Base + {bonusAPR}% Lock Bonus
        </Typography>
      </Box>

      {/* Transaction Preview */}
      <Box sx={{ 
        backgroundColor: theme.palette.action.hover,
        padding: '16px',
        borderRadius: '8px',
        marginBottom: '24px'
      }}>
        <Typography variant="h4" sx={{ marginBottom: '12px' }}>
          Transaction Preview
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
          <Typography variant="body2">Action:</Typography>
          <Typography variant="body2" fontWeight="bold">Stake NFT</Typography>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
          <Typography variant="body2">NFT:</Typography>
          <Typography variant="body2" fontWeight="bold">{nft.name}</Typography>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
          <Typography variant="body2">Lock Period:</Typography>
          <Typography variant="body2" fontWeight="bold">
            {selectedPeriod?.label || 'No Lock'}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="body2">Estimated Fee:</Typography>
          <Typography variant="body2" fontWeight="bold">~0.00001 XLM</Typography>
        </Box>
      </Box>

      {/* Actions */}
      <Box sx={{ display: 'flex', gap: 2 }}>
        <OpaqueButton
          onClick={onCancel}
          disabled={isLoading}
          palette={theme.palette.primary}
          sx={{ flex: 1 }}
        >
          Cancel
        </OpaqueButton>
        <OpaqueButton
          onClick={handleStake}
          disabled={isLoading}
          palette={theme.palette.success}
          sx={{ 
            flex: 1,
            backgroundColor: theme.palette.success.main,
            color: 'white',
            '&:hover': {
              backgroundColor: theme.palette.success.dark
            }
          }}
        >
          {isLoading ? 'Staking...' : 'Stake NFT'}
        </OpaqueButton>
      </Box>

      {error && (
        <AnvilAlert 
          severity="error" 
          message={error} 
        />
      )}
    </Box>
  );
}; 