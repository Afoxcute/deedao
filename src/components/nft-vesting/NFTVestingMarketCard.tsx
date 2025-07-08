import { Box, Typography, useTheme } from '@mui/material';
import { ViewType, useSettings } from '../../contexts';
import { useWallet } from '../../contexts/wallet';
import { OpaqueButton } from '../common/OpaqueButton';

interface NFTVestingCollection {
  id: string;
  name: string;
  totalVested: number;
  claimable: number;
  vestingEnd: Date;
}

interface NFTVestingMarketCardProps {
  poolId: string;
  collection: NFTVestingCollection;
}

export const NFTVestingMarketCard: React.FC<NFTVestingMarketCardProps> = ({ 
  poolId, 
  collection 
}) => {
  const theme = useTheme();
  const { viewType } = useSettings();
  const { connected } = useWallet();

  const handleClaim = () => {
    // In a real implementation, this would trigger the claim transaction
    console.log('Claim NFTs from collection:', collection.id);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const headerWidth = `${(100 / (viewType === ViewType.REGULAR ? 5 : 3)).toFixed(2)}%`;

  return (
    <Box
      sx={{
        width: '100%',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '12px 6px',
        borderBottom: `1px solid ${theme.palette.divider}`,
        '&:hover': {
          backgroundColor: theme.palette.action.hover,
        },
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', width: headerWidth }}>
        <Box sx={{ width: 32, height: 32, marginRight: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            {collection.name.charAt(0)}
          </Typography>
        </Box>
        <Box>
          <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
            {collection.name}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {collection.id.substring(0, 8)}...{collection.id.substring(collection.id.length - 8)}
          </Typography>
        </Box>
      </Box>

      <Box sx={{ width: headerWidth, textAlign: 'center' }}>
        <Typography variant="body2">
          {collection.totalVested}
        </Typography>
      </Box>

      <Box sx={{ width: headerWidth, textAlign: 'center' }}>
        <Typography 
          variant="body2" 
          color={collection.claimable > 0 ? 'success.main' : 'text.secondary'}
        >
          {collection.claimable}
        </Typography>
      </Box>

      {viewType !== ViewType.MOBILE && (
        <Box sx={{ width: headerWidth, textAlign: 'center' }}>
          <Typography variant="body2">
            {formatDate(collection.vestingEnd)}
          </Typography>
        </Box>
      )}

      <Box sx={{ width: viewType === ViewType.MOBILE ? 'auto' : headerWidth, textAlign: 'right' }}>
        {connected ? (
          <OpaqueButton
            onClick={handleClaim}
            palette={theme.palette.primary}
            size="small"
            disabled={collection.claimable === 0}
          >
            {collection.claimable > 0 ? `Claim ${collection.claimable}` : 'No Claimable'}
          </OpaqueButton>
        ) : (
          <Typography variant="caption" color="text.secondary">
            Connect Wallet
          </Typography>
        )}
      </Box>
    </Box>
  );
}; 