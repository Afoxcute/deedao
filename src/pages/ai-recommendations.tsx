import { Alert, Box, Paper, Tab, Tabs, Typography, useTheme } from '@mui/material';
import { useState } from 'react';
import { AIRecommendationPanel } from '../components/ai-recommendations/AIRecommendationPanel';
import { useWallet } from '../contexts/wallet';
import { NFTCollection, NFTStakingPosition } from '../utils/nft';

// Mock token data - replace with actual data from your app
const mockTokenCollections: NFTCollection[] = [
  {
    id: '1',
    name: 'USDC Staking Pool',
    description: 'Stable coin staking with low volatility',
    apr: 0.08,
    totalSupply: 5000000,
    floorPrice: 1.0,
    volume24h: 100000
  },
  {
    id: '2',
    name: 'ETH Staking Pool',
    description: 'Ethereum staking with growth potential',
    apr: 0.12,
    totalSupply: 2000000,
    floorPrice: 2000.0,
    volume24h: 50000
  },
  {
    id: '3',
    name: 'BLND-USDC LP Pool',
    description: 'Liquidity provision with yield farming',
    apr: 0.25,
    totalSupply: 1000000,
    floorPrice: 0.5,
    volume24h: 75000
  }
];

const mockTokenPositions: NFTStakingPosition[] = [
  {
    tokenId: 'USDC-001',
    stakedAt: Date.now() - 30 * 24 * 60 * 60 * 1000,
    stakingRewards: BigInt(8000000), // 8 USDC
    lockPeriod: 30,
    isLocked: false,
    metadata: {
      id: 'USDC-001',
      name: 'USDC Staking Position',
      description: 'USDC staking position in USDC Staking Pool',
      image: '/icons/tokens/blnd.svg',
      collection: 'USDC Staking Pool'
    }
  },
  {
    tokenId: 'ETH-001',
    stakedAt: Date.now() - 15 * 24 * 60 * 60 * 1000,
    stakingRewards: BigInt(1200000000000000000), // 1.2 ETH
    lockPeriod: 90,
    isLocked: true,
    metadata: {
      id: 'ETH-001',
      name: 'ETH Staking Position',
      description: 'ETH staking position in ETH Staking Pool',
      image: '/icons/tokens/blnd.svg',
      collection: 'ETH Staking Pool'
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
      id={`ai-tabpanel-${index}`}
      aria-labelledby={`ai-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

export default function AIRecommendationsPage() {
  const theme = useTheme();
  const { connected, walletAddress, isLoading } = useWallet();
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const getRequestType = (tabIndex: number) => {
    switch (tabIndex) {
      case 0: return 'STAKING_ANALYSIS';
      case 1: return 'VESTING_ANALYSIS';
      case 2: return 'POOL_CREATION';
      case 3: return 'PORTFOLIO_OPTIMIZATION';
      default: return 'STAKING_ANALYSIS';
    }
  };

  const getTabLabel = (tabIndex: number) => {
    switch (tabIndex) {
      case 0: return 'NFT Staking';
      case 1: return 'NFT Vesting';
      case 2: return 'Pool Creation';
      case 3: return 'Portfolio Optimization';
      default: return 'NFT Staking';
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
          Please connect your wallet to access AI investment recommendations.
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
          🪙 Token AI Investment Advisor
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ maxWidth: '600px', margin: '0 auto', marginBottom: '16px' }}>
          Get personalized AI-powered recommendations for your token staking, vesting, and liquidity pool strategies. 
          Our AI analyzes market conditions, your risk profile, and current token positions to provide tailored advice.
        </Typography>
        <Alert severity="info" sx={{ maxWidth: '600px', margin: '0 auto' }}>
          <Typography variant="body2">
            <strong>Token Focus:</strong> This advisor specializes in token-based DeFi activities including staking, 
            vesting, liquidity provision, and impermanent loss management.
          </Typography>
        </Alert>
        </Box>

        {/* Tabs */}
        <Paper sx={{ marginBottom: '24px' }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            aria-label="AI recommendation tabs"
            sx={{
              '& .MuiTab-root': {
                fontSize: '16px',
                fontWeight: 500,
                padding: '16px 24px'
              }
            }}
          >
            <Tab label="Token Staking Analysis" />
            <Tab label="Token Vesting Analysis" />
            <Tab label="Liquidity Pool Creation" />
            <Tab label="Portfolio Optimization" />
          </Tabs>
        </Paper>

        {/* Tab Panels */}
        <TabPanel value={tabValue} index={0}>
          <AIRecommendationPanel
            currentPositions={mockTokenPositions}
            availableCollections={mockTokenCollections}
            requestType="STAKING_ANALYSIS"
          />
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <AIRecommendationPanel
            currentPositions={mockTokenPositions}
            availableCollections={mockTokenCollections}
            requestType="VESTING_ANALYSIS"
          />
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          <AIRecommendationPanel
            currentPositions={mockTokenPositions}
            availableCollections={mockTokenCollections}
            requestType="POOL_CREATION"
          />
        </TabPanel>

        <TabPanel value={tabValue} index={3}>
          <AIRecommendationPanel
            currentPositions={mockTokenPositions}
            availableCollections={mockTokenCollections}
            requestType="PORTFOLIO_OPTIMIZATION"
          />
        </TabPanel>
      </Box>
    </Box>
  );
} 