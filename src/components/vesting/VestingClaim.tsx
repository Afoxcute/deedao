import { Box, Typography } from '@mui/material';
import { useWallet } from '../../contexts/wallet';
import theme from '../../theme';
import { OpaqueButton } from '../common/OpaqueButton';

interface VestingClaimProps {
  claimableAmount: string;
}

export const VestingClaim: React.FC<VestingClaimProps> = ({ claimableAmount }) => {
  const { walletId } = useWallet();

  const handleClaim = async () => {
    // TODO: Implement claim functionality with contract interaction
    console.log('Claiming vested tokens');
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
    </Box>
  );
}; 