import { Box, Typography, useTheme } from '@mui/material';
import { useState } from 'react';
import { ViewType, useSettings } from '../../contexts';
import { useWallet } from '../../contexts/wallet';
import { NFTCollection, NFTMetadata } from '../../utils/nft';
import { OpaqueButton } from '../common/OpaqueButton';
import { NFTStakingForm } from './NFTStakingForm';

interface NFTStakingMarketCardProps {
  poolId: string;
  collection: NFTCollection;
}

export const NFTStakingMarketCard: React.FC<NFTStakingMarketCardProps> = ({ 
  poolId, 
  collection 
}) => {
  const theme = useTheme();
  const { viewType } = useSettings();
  const { connected } = useWallet();
  const [showStakingForm, setShowStakingForm] = useState(false);
  const [selectedNFT, setSelectedNFT] = useState<NFTMetadata | null>(null);

  // Mock data - in a real implementation, you would fetch this from the blockchain
  const nftsOwned = 3; // Mock number of NFTs owned
  const totalStaked = 1250; // Mock total staked NFTs

  // Mock NFTs owned by the user
  const ownedNFTs: NFTMetadata[] = [
    {
      id: '1',
      name: 'Blend Punk #001',
      description: 'A rare Blend Punk NFT',
      image: '/icons/tokens/soroban.svg',
      collection: collection.name,
      rarity: 'Legendary'
    },
    {
      id: '2',
      name: 'Blend Punk #002',
      description: 'Another Blend Punk NFT',
      image: '/icons/tokens/soroban.svg',
      collection: collection.name,
      rarity: 'Epic'
    },
    {
      id: '3',
      name: 'Blend Punk #003',
      description: 'A common Blend Punk NFT',
      image: '/icons/tokens/soroban.svg',
      collection: collection.name,
      rarity: 'Common'
    }
  ];

  const handleStake = () => {
    if (ownedNFTs.length > 0) {
      setSelectedNFT(ownedNFTs[0]); // For demo, select the first NFT
      setShowStakingForm(true);
    }
  };

  const handleStakeNFT = async (tokenId: string, lockPeriod: number) => {
    // In a real implementation, this would call the blockchain to stake the NFT
    console.log('Staking NFT:', tokenId, 'with lock period:', lockPeriod);
    
    // Simulate blockchain delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Close the form
    setShowStakingForm(false);
    setSelectedNFT(null);
  };

  const handleCancelStake = () => {
    setShowStakingForm(false);
    setSelectedNFT(null);
  };

  const headerWidth = `${(100 / (viewType === ViewType.REGULAR ? 5 : 3)).toFixed(2)}%`;

  if (showStakingForm && selectedNFT) {
    return (
      <Box sx={{ padding: '16px' }}>
        <NFTStakingForm
          nft={selectedNFT}
          onStake={handleStakeNFT}
          onCancel={handleCancelStake}
        />
      </Box>
    );
  }

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
          {nftsOwned}
        </Typography>
      </Box>

      <Box sx={{ width: headerWidth, textAlign: 'center' }}>
        <Typography variant="body2">
          {(collection.apr * 100).toFixed(2)}%
        </Typography>
      </Box>

      {viewType !== ViewType.MOBILE && (
        <Box sx={{ width: headerWidth, textAlign: 'center' }}>
          <Typography variant="body2">
            {totalStaked}
          </Typography>
        </Box>
      )}

      <Box sx={{ width: viewType === ViewType.MOBILE ? 'auto' : headerWidth, textAlign: 'right' }}>
        {connected ? (
          <OpaqueButton
            onClick={handleStake}
            palette={theme.palette.primary}
            size="small"
            disabled={nftsOwned <= 0}
          >
            {nftsOwned > 0 ? 'Stake' : 'No NFTs'}
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