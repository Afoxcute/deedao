import { Box, Typography } from '@mui/material';
import { useState } from 'react';
import { useWallet } from '../../contexts/wallet';
import theme from '../../theme';
import { AnvilAlert } from '../common/AnvilAlert';
import { OpaqueButton } from '../common/OpaqueButton';

interface VestingClaimProps {
  claimableAmount: string;
}

export const VestingClaim: React.FC<VestingClaimProps> = ({ claimableAmount }) => {
  const { walletId, connected } = useWallet();
  const [claimStatus, setClaimStatus] = useState<{
    success?: boolean;
    error?: string;
  }>({});

  const handleClaim = async () => {
    if (!connected) {
      setClaimStatus({ error: 'Wallet not connected' });
      return;
    }

    try {
      // TODO: Replace with actual vesting contract claim method
      // Simulated claim process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setClaimStatus({ 
        success: true,
        error: undefined 
      });
    } catch (error) {
      setClaimStatus({ 
        success: false,
        error: error instanceof Error ? error.message : 'Claim failed' 
      });
    }
  };

  return (
    <Box
      sx={{
        marginTop: '24px',
        backgroundColor: theme.palette.background.paper,
        padding: '24px',
        borderRadius: '8px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '16px'
      }}
    >
      <Typography variant="h2">Claim Vested Tokens</Typography>
      <Typography variant="h3" sx={{ color: theme.palette.success.main }}>
        {claimableAmount} BLND Available
      </Typography>
      <OpaqueButton
        onClick={handleClaim}
        disabled={!walletId || parseFloat(claimableAmount) <= 0}
        palette={theme.palette.primary}
        sx={{ width: '200px' }}
      >
        Claim Tokens
      </OpaqueButton>
      
      {claimStatus.error && (
        <AnvilAlert 
          severity="error" 
          message={claimStatus.error} 
        />
      )}
      {claimStatus.success && (
        <AnvilAlert 
          severity="success" 
          message="Tokens claimed successfully!" 
        />
      )}
    </Box>
  );
}; 