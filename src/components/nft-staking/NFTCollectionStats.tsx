import { Box, Typography, useTheme } from '@mui/material';
import { NFTCollection } from '../../utils/nft';

interface NFTCollectionStatsProps {
  collection: NFTCollection;
}

export const NFTCollectionStats: React.FC<NFTCollectionStatsProps> = ({ collection }) => {
  const theme = useTheme();

  // Mock statistics - in a real implementation, these would come from the blockchain
  const stats = {
    totalStaked: 1250,
    totalValue: 125000, // in USD
    averageAPR: 15.5,
    totalRewards: 18750, // in USD
    uniqueStakers: 450,
    floorPrice: 100, // in USD
    volume24h: 5000 // in USD
  };

  return (
    <Box sx={{
      backgroundColor: theme.palette.background.paper,
      borderRadius: '8px',
      padding: '24px',
      border: `1px solid ${theme.palette.divider}`,
      marginBottom: '24px'
    }}>
      <Typography variant="h3" sx={{ marginBottom: '16px' }}>
        {collection.name} Collection
      </Typography>

      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: { xs: '1fr 1fr', md: 'repeat(4, 1fr)' },
        gap: 3,
        marginBottom: '24px'
      }}>
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h4" color="primary.main" sx={{ marginBottom: '4px' }}>
            {stats.totalStaked.toLocaleString()}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            NFTs Staked
          </Typography>
        </Box>

        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h4" color="success.main" sx={{ marginBottom: '4px' }}>
            ${stats.totalValue.toLocaleString()}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Total Value Locked
          </Typography>
        </Box>

        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h4" color="warning.main" sx={{ marginBottom: '4px' }}>
            {stats.averageAPR.toFixed(1)}%
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Average APR
          </Typography>
        </Box>

        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h4" color="info.main" sx={{ marginBottom: '4px' }}>
            {stats.uniqueStakers.toLocaleString()}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Unique Stakers
          </Typography>
        </Box>
      </Box>

      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
        gap: 2
      }}>
        <Box sx={{ 
          backgroundColor: theme.palette.action.hover,
          padding: '16px',
          borderRadius: '8px',
          textAlign: 'center'
        }}>
          <Typography variant="h5" sx={{ marginBottom: '4px' }}>
            ${stats.totalRewards.toLocaleString()}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Total Rewards Distributed
          </Typography>
        </Box>

        <Box sx={{ 
          backgroundColor: theme.palette.action.hover,
          padding: '16px',
          borderRadius: '8px',
          textAlign: 'center'
        }}>
          <Typography variant="h5" sx={{ marginBottom: '4px' }}>
            ${stats.floorPrice}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Floor Price
          </Typography>
        </Box>

        <Box sx={{ 
          backgroundColor: theme.palette.action.hover,
          padding: '16px',
          borderRadius: '8px',
          textAlign: 'center'
        }}>
          <Typography variant="h5" sx={{ marginBottom: '4px' }}>
            ${stats.volume24h.toLocaleString()}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            24h Volume
          </Typography>
        </Box>
      </Box>

      <Box sx={{ 
        marginTop: '16px',
        padding: '16px',
        backgroundColor: theme.palette.primary.main,
        color: 'white',
        borderRadius: '8px',
        textAlign: 'center'
      }}>
        <Typography variant="h4" sx={{ marginBottom: '4px' }}>
          {(collection.apr * 100).toFixed(1)}% APR
        </Typography>
        <Typography variant="body2">
          Current staking rewards for this collection
        </Typography>
      </Box>
    </Box>
  );
}; 