import { Box, Tab, Tabs, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { Divider } from '../components/common/Divider';
import { Row } from '../components/common/Row';
import { Section, SectionSize } from '../components/common/Section';
import { NFTStakingMarketList } from '../components/nft-staking/NFTStakingMarketList';
import { NFTStakingPositions } from '../components/nft-staking/NFTStakingPositions';
import { NFTStakingRewards } from '../components/nft-staking/NFTStakingRewards';
import { useSettings } from '../contexts';
import { useWallet } from '../contexts/wallet';
import { usePool, usePoolMeta, usePoolOracle } from '../hooks/api';
import theme from '../theme';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`nft-staking-tabpanel-${index}`}
      aria-labelledby={`nft-staking-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

export default function NFTStakingPage() {
  const router = useRouter();
  const { walletId } = useWallet();
  const { lastPool } = useSettings();
  const { data: poolMeta } = usePoolMeta(
    (router.query.poolId as string | undefined) ?? lastPool?.id ?? ''
  );
  const { data: pool } = usePool(poolMeta);
  const { data: poolOracle } = usePoolOracle(pool);
  const [tabValue, setTabValue] = useState(0);

  const hasData = pool && poolOracle;

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <Box sx={{ width: '100%', maxWidth: '1200px', margin: '0 auto', padding: '24px' }}>
      <Row sx={{ justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <Typography variant="h1">NFT Staking</Typography>
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
          <Typography variant="h2">Connect your wallet to view NFT staking details</Typography>
        </Box>
      ) : (
        <>
          {hasData && (
            <>
              <Box sx={{ borderBottom: 1, borderColor: 'divider', marginBottom: '24px' }}>
                <Tabs value={tabValue} onChange={handleTabChange} aria-label="NFT staking tabs">
                  <Tab label="Available Collections" />
                  <Tab label="Your Positions" />
                  <Tab label="Rewards & Analytics" />
                </Tabs>
              </Box>

              <TabPanel value={tabValue} index={0}>
                <Section width={SectionSize.FULL} sx={{ padding: '6px', display: 'flex', flexDirection: 'column' }}>
                  <NFTStakingMarketList poolId={poolMeta?.id ?? ''} />
                </Section>
              </TabPanel>

              <TabPanel value={tabValue} index={1}>
                <NFTStakingPositions poolId={poolMeta?.id ?? ''} />
              </TabPanel>

              <TabPanel value={tabValue} index={2}>
                <NFTStakingRewards poolId={poolMeta?.id ?? ''} />
              </TabPanel>
            </>
          )}
        </>
      )}
    </Box>
  );
} 