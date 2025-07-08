import { Box, Typography } from '@mui/material';
import { ViewType, useSettings } from '../../contexts';
import { usePool, usePoolMeta } from '../../hooks/api';
import { PoolComponentProps } from '../common/PoolComponentProps';
import { Skeleton } from '../common/Skeleton';
import { TooltipText } from '../common/TooltipText';
import { NFTVestingMarketCard } from './NFTVestingMarketCard';

export const NFTVestingMarketList: React.FC<PoolComponentProps> = ({ poolId }) => {
  const { viewType } = useSettings();

  const { data: poolMeta } = usePoolMeta(poolId);
  const { data: pool } = usePool(poolMeta);

  if (pool === undefined) {
    return <Skeleton />;
  }

  const headerNum = viewType === ViewType.REGULAR ? 5 : 3;
  const headerWidth = `${(100 / headerNum).toFixed(2)}%`;
  
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
      <Box
        sx={{
          width: '100%',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '6px',
          type: 'alt',
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
          Total Vested
        </Typography>

        <TooltipText
          tooltip="The number of NFTs that are currently available to claim from your vesting schedule."
          width={headerWidth}
        >
          Claimable
        </TooltipText>

        {viewType !== ViewType.MOBILE && (
          <TooltipText
            tooltip="The end date of your vesting schedule for this collection."
            width={headerWidth}
          >
            Vesting End
          </TooltipText>
        )}
        <Box sx={{ width: viewType === ViewType.MOBILE ? 'auto' : headerWidth }} />
      </Box>
      
      {/* For now, we'll show hardcoded NFT collections with vesting */}
      {/* In a real implementation, you would fetch these from the blockchain */}
      {[
        { 
          id: 'CDJEHTBE6ZHUXSWFI642DCGLUOECLHPF3KSXHPXTSTJ7E3JF6MQ5EZYY', 
          name: 'Blend Punks', 
          totalVested: 10,
          claimable: 3,
          vestingEnd: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) // 1 year from now
        },
        { 
          id: 'CCOQM6S7ICIUWA225O5PSJWUBEMXGFSSW2PQFO6FP4DQEKMS5DASRGRR', 
          name: 'Stellar Apes', 
          totalVested: 5,
          claimable: 0,
          vestingEnd: new Date(Date.now() + 730 * 24 * 60 * 60 * 1000) // 2 years from now
        },
        { 
          id: 'CAQQR5SWBXKIGZKPBZDH3KM5GQ5GUTPKB7JAFCINLZBC5WXPJKRG3IM7', 
          name: 'Space Cats', 
          totalVested: 8,
          claimable: 8,
          vestingEnd: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // 30 days ago (fully vested)
        },
      ].map((collection) => (
        <NFTVestingMarketCard 
          key={collection.id} 
          poolId={poolId} 
          collection={collection} 
        />
      ))}
    </Box>
  );
}; 