import { Alert, Box, Paper, Tab, Tabs, Typography, useTheme } from '@mui/material';
import { useState } from 'react';
import { NFTAIRecommendationPanel } from '../components/nft-ai-recommendations/NFTAIRecommendationPanel';
import { useWallet } from '../contexts/wallet';
import { NFTCollection, NFTStakingPosition, NFTVestingSchedule } from '../utils/nft';

// Mock NFT data - replace with actual data from your app
const mockNFTCollections: NFTCollection[] = [
  {
    id: '1',
    name: 'Bored Ape Yacht Club',
    description: 'Exclusive NFT collection with strong community',
    apr: 0.15,
    totalSupply: 10000,
    floorPrice: 25.0,
    volume24h: 500000
  },
  {
    id: '2',
    name: 'CryptoPunks',
    description: 'Historical NFT collection with high value',
    apr: 0.12,
    totalSupply: 10000,
    floorPrice: 50.0,
    volume24h: 300000
  },
  {
    id: '3',
    name: 'Doodles',
    description: 'Colorful NFT collection with growing community',
    apr: 0.18,
    totalSupply: 10000,
    floorPrice: 8.0,
    volume24h: 200000
  }
];

const mockNFTPositions: NFTStakingPosition[] = [
  {
    tokenId: 'BAYC-1234',
    stakedAt: Date.now() - 30 * 24 * 60 * 60 * 1000,
    stakingRewards: BigInt(15000000), // 15 ETH
    lockPeriod: 30,
    isLocked: false,
    metadata: {
      id: 'BAYC-1234',
      name: 'Bored Ape #1234',
      description: 'Rare Bored Ape with unique traits',
      image: '/icons/tokens/blnd.svg',
      collection: 'Bored Ape Yacht Club',
      rarity: 'Legendary'
    }
  },
  {
    tokenId: 'PUNK-5678',
    stakedAt: Date.now() - 15 * 24 * 60 * 60 * 1000,
    stakingRewards: BigInt(12000000000000000000), // 12 ETH
    lockPeriod: 90,
    isLocked: true,
    metadata: {
      id: 'PUNK-5678',
      name: 'CryptoPunk #5678',
      description: 'Classic CryptoPunk with high value',
      image: '/icons/tokens/blnd.svg',
      collection: 'CryptoPunks',
      rarity: 'Epic'
    }
  }
];

const mockNFTVestingSchedules: NFTVestingSchedule[] = [
  {
    tokenId: 'DOODLE-9999',
    totalAmount: BigInt(1000000000000000000), // 1 NFT
    claimedAmount: BigInt(250000000000000000), // 0.25 NFT
    startTime: Date.now() - 60 * 24 * 60 * 60 * 1000,
    endTime: Date.now() + 300 * 24 * 60 * 60 * 1000,
    cliffTime: Date.now() - 30 * 24 * 60 * 60 * 1000,
    isCliffReached: true,
    metadata: {
      id: 'DOODLE-9999',
      name: 'Doodle #9999',
      description: 'Vesting Doodle NFT',
      image: '/icons/tokens/blnd.svg',
      collection: 'Doodles',
      rarity: 'Rare'
    }
  }
];

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
      id={`nft-ai-tabpanel-${index}`}
      aria-labelledby={`nft-ai-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

export default function NFTAIRecommendationsPage() {
  const theme = useTheme();
  const { connected, walletAddress, isLoading } = useWallet();
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const getRequestType = (tabIndex: number) => {
    switch (tabIndex) {
      case 0: return 'NFT_STAKING_ANALYSIS';
      case 1: return 'NFT_VESTING_ANALYSIS';
      case 2: return 'NFT_POOL_CREATION';
      case 3: return 'NFT_PORTFOLIO_OPTIMIZATION';
      default: return 'NFT_STAKING_ANALYSIS';
    }
  };

  // Show loading state while wallet is connecting
  if (isLoading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center', 
        minHeight: '60vh',
        padding: '24px'
      }}>
        <Typography variant="h4" sx={{ marginBottom: '16px', textAlign: 'center' }}>
          Connecting Wallet...
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center' }}>
          Please wait while we connect to your wallet.
        </Typography>
      </Box>
    );
  }

  // Show wallet connection prompt if not connected
  if (!connected || !walletAddress) {
    return (
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center', 
        minHeight: '60vh',
        padding: '24px'
      }}>
        <Typography variant="h4" sx={{ marginBottom: '16px', textAlign: 'center' }}>
          Connect Your Wallet
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center', marginBottom: '24px' }}>
          Please connect your wallet to access NFT AI investment recommendations.
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
          Connected: {connected ? 'Yes' : 'No'} | Address: {walletAddress || 'None'}
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      minHeight: '100vh',
      backgroundColor: theme.palette.background.default,
      padding: '24px'
    }}>
      <Box sx={{ maxWidth: '1400px', margin: '0 auto' }}>
        {/* Header */}
        <Box sx={{ marginBottom: '32px', textAlign: 'center' }}>
          <Typography variant="h1" sx={{ marginBottom: '16px' }}>
            🎨 NFT AI Investment Advisor
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ maxWidth: '600px', margin: '0 auto', marginBottom: '16px' }}>
            Get personalized AI-powered recommendations for your NFT staking, vesting, and stake pool creation strategies. 
            Our AI analyzes market conditions, your risk profile, and current NFT positions to provide tailored advice.
          </Typography>
          <Alert severity="info" sx={{ maxWidth: '600px', margin: '0 auto' }}>
            <Typography variant="body2">
              <strong>NFT Focus:</strong> This advisor specializes in NFT-based DeFi activities including staking, 
              vesting, stake pool creation, and collection diversification strategies.
            </Typography>
          </Alert>
        </Box>

        {/* Tabs */}
        <Paper sx={{ marginBottom: '24px' }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            aria-label="NFT AI recommendation tabs"
            sx={{
              '& .MuiTab-root': {
                fontSize: '16px',
                fontWeight: 500,
                padding: '16px 24px'
              }
            }}
          >
            <Tab label="NFT Staking Analysis" />
            <Tab label="NFT Vesting Analysis" />
            <Tab label="NFT Pool Creation" />
            <Tab label="NFT Portfolio Optimization" />
          </Tabs>
        </Paper>

        {/* Tab Panels */}
        <TabPanel value={tabValue} index={0}>
          <NFTAIRecommendationPanel
            currentStakingPositions={mockNFTPositions}
            currentVestingSchedules={[]}
            availableCollections={mockNFTCollections}
            requestType="NFT_STAKING_ANALYSIS"
          />
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <NFTAIRecommendationPanel
            currentStakingPositions={[]}
            currentVestingSchedules={mockNFTVestingSchedules}
            availableCollections={mockNFTCollections}
            requestType="NFT_VESTING_ANALYSIS"
          />
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          <NFTAIRecommendationPanel
            currentStakingPositions={mockNFTPositions}
            currentVestingSchedules={mockNFTVestingSchedules}
            availableCollections={mockNFTCollections}
            requestType="NFT_POOL_CREATION"
          />
        </TabPanel>

        <TabPanel value={tabValue} index={3}>
          <NFTAIRecommendationPanel
            currentStakingPositions={mockNFTPositions}
            currentVestingSchedules={mockNFTVestingSchedules}
            availableCollections={mockNFTCollections}
            requestType="NFT_PORTFOLIO_OPTIMIZATION"
          />
        </TabPanel>

        {/* NFT-Specific Features Info */}
        <Box sx={{ marginTop: '32px', padding: '24px', backgroundColor: theme.palette.background.paper, borderRadius: '12px' }}>
          <Typography variant="h4" sx={{ marginBottom: '16px' }}>
            🎨 NFT-Specific Features
          </Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 2 }}>
            <Box>
              <Typography variant="h6" color="primary.main">Collection Analysis</Typography>
              <Typography variant="body2" color="text.secondary">
                Deep analysis of NFT collection rarity, utility, and community strength
              </Typography>
            </Box>
            <Box>
              <Typography variant="h6" color="primary.main">Floor Price Stability</Typography>
              <Typography variant="body2" color="text.secondary">
                Assessment of floor price trends and volatility for informed decisions
              </Typography>
            </Box>
            <Box>
              <Typography variant="h6" color="primary.main">Smart Contract Security</Typography>
              <Typography variant="body2" color="text.secondary">
                Evaluation of smart contract risks and security measures
              </Typography>
            </Box>
            <Box>
              <Typography variant="h6" color="primary.main">Community Strength</Typography>
              <Typography variant="body2" color="text.secondary">
                Analysis of community engagement and project sustainability
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
} 