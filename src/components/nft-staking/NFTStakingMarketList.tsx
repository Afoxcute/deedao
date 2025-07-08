import { ExpandMore } from '@mui/icons-material';
import { Accordion, AccordionDetails, AccordionSummary, Box, Typography } from '@mui/material';
import { useState } from 'react';
import { ViewType, useSettings } from '../../contexts';
import { usePool, usePoolMeta } from '../../hooks/api';
import { NFTCollection } from '../../utils/nft';
import { PoolComponentProps } from '../common/PoolComponentProps';
import { Skeleton } from '../common/Skeleton';
import { TooltipText } from '../common/TooltipText';
import { NFTCollectionStats } from './NFTCollectionStats';
import { NFTStakingMarketCard } from './NFTStakingMarketCard';

export const NFTStakingMarketList: React.FC<PoolComponentProps> = ({ poolId }) => {
  const { viewType } = useSettings();
  const [expandedCollection, setExpandedCollection] = useState<string | null>(null);

  const { data: poolMeta } = usePoolMeta(poolId);
  const { data: pool } = usePool(poolMeta);

  if (pool === undefined) {
    return <Skeleton />;
  }

  const headerNum = viewType === ViewType.REGULAR ? 5 : 3;
  const headerWidth = `${(100 / headerNum).toFixed(2)}%`;

  // Mock NFT collections - in a real implementation, these would come from the blockchain
  const collections: NFTCollection[] = [
    { id: 'CDJEHTBE6ZHUXSWFI642DCGLUOECLHPF3KSXHPXTSTJ7E3JF6MQ5EZYY', name: 'Blend Punks', apr: 0.12 },
    { id: 'CCOQM6S7ICIUWA225O5PSJWUBEMXGFSSW2PQFO6FP4DQEKMS5DASRGRR', name: 'Stellar Apes', apr: 0.08 },
    { id: 'CAQQR5SWBXKIGZKPBZDH3KM5GQ5GUTPKB7JAFCINLZBC5WXPJKRG3IM7', name: 'Space Cats', apr: 0.15 },
  ];

  const handleAccordionChange = (collectionId: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpandedCollection(isExpanded ? collectionId : null);
  };
  
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        overflow: 'auto',
        scrollbarColor: 'black grey',
        padding: '6px',
      }}
    >
      <Typography variant="h2" sx={{ marginBottom: '24px' }}>
        Available NFT Collections
      </Typography>

      {collections.map((collection) => (
        <Accordion 
          key={collection.id}
          expanded={expandedCollection === collection.id}
          onChange={handleAccordionChange(collection.id)}
          sx={{ marginBottom: '16px' }}
        >
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Box sx={{ width: '100%' }}>
              <Box
                sx={{
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '6px',
                }}
              >
                <Typography variant="body2" color="text.secondary" sx={{ width: headerWidth }}>
                  Collection
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  align="center"
                  sx={{ width: headerWidth }}
                >
                  NFTs Owned
                </Typography>

                <TooltipText
                  tooltip="The estimated annual percentage rate earned from staking NFTs in this collection. This rate may vary based on market conditions and total staked amount."
                  width={headerWidth}
                >
                  APR
                </TooltipText>

                {viewType !== ViewType.MOBILE && (
                  <TooltipText
                    tooltip="The total number of NFTs currently staked in this collection."
                    width={headerWidth}
                  >
                    Total Staked
                  </TooltipText>
                )}
                <Box sx={{ width: viewType === ViewType.MOBILE ? 'auto' : headerWidth }} />
              </Box>
              
              <NFTStakingMarketCard 
                poolId={poolId} 
                collection={collection} 
              />
            </Box>
          </AccordionSummary>
          
          <AccordionDetails>
            <NFTCollectionStats collection={collection} />
          </AccordionDetails>
        </Accordion>
      ))}
    </Box>
  );
}; 