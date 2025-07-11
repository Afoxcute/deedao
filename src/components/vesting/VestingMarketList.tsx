import { Box, Typography } from '@mui/material';
import { ViewType, useSettings } from '../../contexts';
import { usePool, usePoolMeta } from '../../hooks/api';
import { PoolComponentProps } from '../common/PoolComponentProps';
import { Skeleton } from '../common/Skeleton';
import { TooltipText } from '../common/TooltipText';
import { VestingMarketCard } from './VestingMarketCard';

export const VestingMarketList: React.FC<PoolComponentProps> = ({ poolId }) => {
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
          Asset
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
          tooltip="The amount of tokens that are currently available to claim from your vesting schedule."
          width={headerWidth}
        >
          Claimable
        </TooltipText>

        {viewType !== ViewType.MOBILE && (
          <TooltipText
            tooltip="The end date of your vesting schedule for this asset."
            width={headerWidth}
          >
            Vesting End
          </TooltipText>
        )}
        <Box sx={{ width: viewType === ViewType.MOBILE ? 'auto' : headerWidth }} />
      </Box>
      {Array.from(pool.reserves.values()).map((reserve) => (
        <VestingMarketCard key={reserve.assetId} poolId={poolId} reserve={reserve} />
      ))}
    </Box>
  );
}; 