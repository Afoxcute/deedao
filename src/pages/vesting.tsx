import { Box, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import { Divider } from '../components/common/Divider';
import { Row } from '../components/common/Row';
import { Section, SectionSize } from '../components/common/Section';
import { VestingMarketList } from '../components/vesting/VestingMarketList';
import { useSettings } from '../contexts';
import { useWallet } from '../contexts/wallet';
import { usePool, usePoolMeta, usePoolOracle } from '../hooks/api';
import theme from '../theme';

export default function VestingPage() {
  const router = useRouter();
  const { walletId } = useWallet();
  const { lastPool } = useSettings();
  const { data: poolMeta } = usePoolMeta(
    (router.query.poolId as string | undefined) ?? lastPool?.id ?? ''
  );
  const { data: pool } = usePool(poolMeta);
  const { data: poolOracle } = usePoolOracle(pool);

  const hasData = pool && poolOracle;

  return (
    <Box sx={{ width: '100%', maxWidth: '1200px', margin: '0 auto', padding: '24px' }}>
      <Row sx={{ justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <Typography variant="h1">Token Vesting</Typography>
      </Row>
      <Divider />
      
      {!walletId ? (
        <Box sx={{ 
          textAlign: 'center', 
          marginTop: '48px',
          backgroundColor: theme.palette.background.paper,
          padding: '24px',
          borderRadius: '8px'
        }}>
          <Typography variant="h2">Connect your wallet to view vesting details</Typography>
        </Box>
      ) : (
        <>
          {hasData && (
            <Section width={SectionSize.FULL} sx={{ padding: '6px', display: 'flex', flexDirection: 'column' }}>
              <VestingMarketList poolId={poolMeta?.id ?? ''} />
            </Section>
          )}
        </>
      )}
    </Box>
  );
} 