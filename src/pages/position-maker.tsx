import { parseResult, PoolContractV1, Positions, RequestType, SubmitArgs } from '@blend-capital/blend-sdk';
import LockClockIcon from '@mui/icons-material/LockClock';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import StorageIcon from '@mui/icons-material/Storage';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import {
  Box,
  Button,
  Chip,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  MenuItem,
  Paper,
  Select,
  Slider,
  Tab,
  Tabs,
  TextField,
  Typography,
  useTheme
} from '@mui/material';
import { rpc } from '@stellar/stellar-sdk';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { InputBar } from '../components/common/InputBar';
import { InputButton } from '../components/common/InputButton';
import { TxOverview } from '../components/common/TxOverview';
import { MarketsList } from '../components/markets/MarketsList';
import { StakingMarketList } from '../components/staking/StakingMarketList';
import { VestingMarketList } from '../components/vesting/VestingMarketList';
import { useSettings } from '../contexts';
import { useWallet } from '../contexts/wallet';
import {
  useHorizonAccount,
  usePool,
  usePoolMeta,
  usePoolOracle,
  useTokenMetadata
} from '../hooks/api';
import { RPC_DEBOUNCE_DELAY, useDebouncedState } from '../hooks/debounce';
import { toCompactAddress } from '../utils/formatter';
import { getAssetReserve } from '../utils/horizon';
import { scaleInputToBigInt } from '../utils/scval';

interface Position {
  id: string;
  symbol: string;
  type: 'long' | 'short' | 'stake' | 'vest';
  amount: number;
  entryPrice: number;
  currentPrice: number;
  pnl: number;
  pnlPercentage: number;
  timestamp: Date;
  poolId?: string;
  assetId?: string;
  vestingSchedule?: {
    startDate: Date;
    endDate: Date;
    totalAmount: number;
    claimedAmount: number;
  };
}

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
      id={`position-tabpanel-${index}`}
      aria-labelledby={`position-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

export default function PositionMakerPage() {
  const theme = useTheme();
  const router = useRouter();
  const { viewType } = useSettings();
  const { connected, walletAddress, poolSubmit, txStatus, txType, isLoading } = useWallet();
  
  // Pool and market data
  const safePoolId = router.query.poolId as string;
  const { data: poolMeta } = usePoolMeta(safePoolId, safePoolId !== undefined && safePoolId !== '');
  const { data: pool } = usePool(poolMeta);
  const { data: poolOracle } = usePoolOracle(pool);
  const { data: horizonAccount } = useHorizonAccount();

  // State management
  const [positions, setPositions] = useState<Position[]>([]);
  const [activeTab, setActiveTab] = useState(0);
  const [formData, setFormData] = useState({
    symbol: '',
    type: 'long',
    amount: 100,
    entryPrice: 0,
    leverage: 1,
    poolId: '',
    assetId: '',
    vestingDuration: 12, // months
    vestingCliff: 3 // months
  });
  const { data: tokenMetadata } = useTokenMetadata(formData.assetId);

  // Staking specific state
  const [toStake, setToStake] = useState<string>('');
  const [simResponse, setSimResponse] = useState<rpc.Api.SimulateTransactionResponse>();
  const [parsedSimResult, setParsedSimResult] = useState<Positions>();
  const [loadingEstimate, setLoadingEstimate] = useState<boolean>(false);

  const loading = isLoading || loadingEstimate;

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const createPosition = () => {
    if (!formData.symbol || formData.amount <= 0 || formData.entryPrice <= 0) {
      return;
    }

    const newPosition: Position = {
      id: Date.now().toString(),
      symbol: formData.symbol.toUpperCase(),
      type: formData.type as 'long' | 'short' | 'stake' | 'vest',
      amount: formData.amount,
      entryPrice: formData.entryPrice,
      currentPrice: formData.entryPrice,
      pnl: 0,
      pnlPercentage: 0,
      timestamp: new Date(),
      poolId: formData.poolId,
      assetId: formData.assetId,
      vestingSchedule: formData.type === 'vest' ? {
        startDate: new Date(),
        endDate: new Date(Date.now() + formData.vestingDuration * 30 * 24 * 60 * 60 * 1000),
        totalAmount: formData.amount,
        claimedAmount: 0
      } : undefined
    };

    setPositions(prev => [newPosition, ...prev]);
    
    // Reset form
    setFormData({
      symbol: '',
      type: 'long',
      amount: 100,
      entryPrice: 0,
      leverage: 1,
      poolId: '',
      assetId: '',
      vestingDuration: 12,
      vestingCliff: 3
    });
  };

  const closePosition = (positionId: string) => {
    setPositions(prev => prev.filter(p => p.id !== positionId));
  };

  const getPnlColor = (pnl: number) => {
    return pnl >= 0 ? theme.palette.success.main : theme.palette.error.main;
  };

  const getPositionTypeIcon = (type: string) => {
    switch (type) {
      case 'long':
        return <TrendingUpIcon sx={{ color: 'success.main' }} />;
      case 'short':
        return <TrendingDownIcon sx={{ color: 'error.main' }} />;
      case 'stake':
        return <StorageIcon sx={{ color: 'primary.main' }} />;
      case 'vest':
        return <LockClockIcon sx={{ color: 'warning.main' }} />;
      default:
        return <ShowChartIcon />;
    }
  };

  const getPositionTypeColor = (type: string) => {
    switch (type) {
      case 'long':
        return 'success';
      case 'short':
        return 'error';
      case 'stake':
        return 'primary';
      case 'vest':
        return 'warning';
      default:
        return 'default';
    }
  };

  // Staking transaction handling
  const handleSubmitStakingTransaction = async (sim: boolean) => {
    if (toStake && connected && poolMeta && pool) {
      const assetId = formData.assetId || pool.reserves.keys().next().value;
      const reserve = pool.reserves.get(assetId);
      
      if (!reserve) return;

      let submitArgs: SubmitArgs = {
        from: walletAddress,
        spender: walletAddress,
        to: walletAddress,
        requests: [
          {
            amount: scaleInputToBigInt(toStake, reserve.config.decimals),
            request_type: RequestType.SupplyCollateral,
            address: reserve.assetId,
          },
        ],
      };
      
      let response = await poolSubmit(poolMeta, submitArgs, sim);
      if (response && sim) {
        setSimResponse(response);
        if (rpc.Api.isSimulationSuccess(response)) {
          setParsedSimResult(parseResult(response, PoolContractV1.parsers.submit));
        }
      }
      return response;
    }
  };

  useDebouncedState(toStake, RPC_DEBOUNCE_DELAY, txType, async () => {
    setSimResponse(undefined);
    setParsedSimResult(undefined);
    let response = await handleSubmitStakingTransaction(true);
    if (response) {
      setSimResponse(response);
      if (rpc.Api.isSimulationSuccess(response)) {
        setParsedSimResult(parseResult(response, PoolContractV1.parsers.submit));
      }
    }
    setLoadingEstimate(false);
  });

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
        <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center' }}>
          Please connect your wallet to access the Position Maker.
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
            📈 Position Maker
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ maxWidth: '800px', margin: '0 auto' }}>
            Create and manage positions across trading, staking, vesting, and pool markets with a unified interface.
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {/* Position Creation Form */}
          <Grid item xs={12} md={4}>
            <Paper sx={{ padding: '24px', height: 'fit-content' }}>
              <Typography variant="h5" sx={{ marginBottom: '24px', display: 'flex', alignItems: 'center' }}>
                <ShowChartIcon sx={{ marginRight: '8px' }} />
                Create Position
              </Typography>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <TextField
                  label="Symbol"
                  value={formData.symbol}
                  onChange={(e) => handleInputChange('symbol', e.target.value)}
                  placeholder="e.g., BTC, ETH, BLND"
                  fullWidth
                />

                <FormControl fullWidth>
                  <InputLabel>Position Type</InputLabel>
                  <Select
                    value={formData.type}
                    label="Position Type"
                    onChange={(e) => handleInputChange('type', e.target.value)}
                  >
                    <MenuItem value="long">
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <TrendingUpIcon sx={{ color: 'success.main', marginRight: '8px' }} />
                        Long Position
                      </Box>
                    </MenuItem>
                    <MenuItem value="short">
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <TrendingDownIcon sx={{ color: 'error.main', marginRight: '8px' }} />
                        Short Position
                      </Box>
                    </MenuItem>
                    <MenuItem value="stake">
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <StorageIcon sx={{ color: 'primary.main', marginRight: '8px' }} />
                        Staking Position
                      </Box>
                    </MenuItem>
                    <MenuItem value="vest">
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <LockClockIcon sx={{ color: 'warning.main', marginRight: '8px' }} />
                        Vesting Position
                      </Box>
                    </MenuItem>
                  </Select>
                </FormControl>

                {formData.type === 'stake' && pool && (
                  <FormControl fullWidth>
                    <InputLabel>Pool</InputLabel>
                    <Select
                      value={formData.poolId}
                      label="Pool"
                      onChange={(e) => handleInputChange('poolId', e.target.value)}
                    >
                      <MenuItem value={pool.id}>{pool.id}</MenuItem>
                    </Select>
                  </FormControl>
                )}

                {formData.type === 'stake' && pool && (
                  <FormControl fullWidth>
                    <InputLabel>Asset</InputLabel>
                    <Select
                      value={formData.assetId}
                      label="Asset"
                      onChange={(e) => handleInputChange('assetId', e.target.value)}
                    >
                      {Array.from(pool.reserves.keys()).map((assetId) => (
                        <MenuItem key={assetId} value={assetId}>
                          {toCompactAddress(assetId)}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}

                {formData.type !== 'stake' && (
                  <>
                    <TextField
                      label="Amount ($)"
                      type="number"
                      value={formData.amount}
                      onChange={(e) => handleInputChange('amount', parseFloat(e.target.value) || 0)}
                      fullWidth
                    />

                    <TextField
                      label="Entry Price ($)"
                      type="number"
                      value={formData.entryPrice}
                      onChange={(e) => handleInputChange('entryPrice', parseFloat(e.target.value) || 0)}
                      fullWidth
                    />

                    <Box>
                      <Typography variant="body2" color="text.secondary" sx={{ marginBottom: '8px' }}>
                        Leverage: {formData.leverage}x
                      </Typography>
                      <Slider
                        value={formData.leverage}
                        onChange={(_, value) => handleInputChange('leverage', value)}
                        min={1}
                        max={10}
                        marks
                        valueLabelDisplay="auto"
                      />
                    </Box>
                  </>
                )}

                {formData.type === 'stake' && (
                  <Box>
                    <Typography variant="body2" color="text.secondary" sx={{ marginBottom: '8px' }}>
                      Amount to stake
                    </Typography>
                    <InputBar
                      symbol={formData.assetId ? toCompactAddress(formData.assetId) : 'TOKEN'}
                      value={toStake}
                      onValueChange={(v) => {
                        setToStake(v);
                        setLoadingEstimate(true);
                      }}
                      sx={{ width: '100%' }}
                      palette={theme.palette.primary}
                    >
                      <InputButton
                        palette={theme.palette.primary}
                        disabled={false}
                        onClick={() => {
                          // Handle max stake
                          const assetId = formData.assetId || pool?.reserves.keys().next().value;
                          const reserve = pool?.reserves.get(assetId);
                          if (reserve) {
                            const stellar_reserve_amount = getAssetReserve(horizonAccount, tokenMetadata?.asset);
                            const freeUserBalanceScaled = stellar_reserve_amount ? Number(stellar_reserve_amount) / Math.pow(10, reserve.config.decimals) : 0;
                            if (freeUserBalanceScaled > 0) {
                              setToStake(freeUserBalanceScaled.toFixed(reserve.config.decimals));
                              setLoadingEstimate(true);
                            }
                          }
                        }}
                        text="MAX"
                      />
                    </InputBar>
                  </Box>
                )}

                {formData.type === 'vest' && (
                  <>
                    <TextField
                      label="Vesting Duration (months)"
                      type="number"
                      value={formData.vestingDuration}
                      onChange={(e) => handleInputChange('vestingDuration', parseInt(e.target.value) || 12)}
                      fullWidth
                    />
                    <TextField
                      label="Vesting Cliff (months)"
                      type="number"
                      value={formData.vestingCliff}
                      onChange={(e) => handleInputChange('vestingCliff', parseInt(e.target.value) || 3)}
                      fullWidth
                    />
                  </>
                )}

                <Button
                  variant="contained"
                  onClick={formData.type === 'stake' ? 
                    () => handleSubmitStakingTransaction(false) : 
                    createPosition
                  }
                  sx={{
                    background: 'linear-gradient(45deg, #00FF00 30%, #00CC00 90%)',
                    color: 'white',
                    fontWeight: 'bold',
                    padding: '12px',
                    marginTop: '16px'
                  }}
                  disabled={formData.type === 'stake' ? !toStake || loading : !formData.symbol || formData.amount <= 0}
                >
                  {formData.type === 'stake' ? 'Stake' : 'Create Position'}
                </Button>
              </Box>
            </Paper>
          </Grid>

          {/* Positions and Markets */}
          <Grid item xs={12} md={8}>
            <Paper sx={{ padding: '24px' }}>
              <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={activeTab} onChange={handleTabChange} aria-label="position tabs">
                  <Tab label="My Positions" />
                  <Tab label="Markets" />
                  <Tab label="Staking Pools" />
                  <Tab label="Vesting" />
                </Tabs>
              </Box>

              <TabPanel value={activeTab} index={0}>
                <Typography variant="h6" sx={{ marginBottom: '16px' }}>
                  Active Positions ({positions.length})
                </Typography>
                
                {positions.length === 0 ? (
                  <Box sx={{ textAlign: 'center', padding: '48px' }}>
                    <Typography variant="body1" color="text.secondary">
                      No positions yet. Create your first position to get started!
                    </Typography>
                  </Box>
                ) : (
                  <List>
                    {positions.map((position) => (
                      <ListItem key={position.id} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: '8px', marginBottom: '8px' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                          {getPositionTypeIcon(position.type)}
                          <ListItemText
                            primary={
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Typography variant="body1" fontWeight="bold">
                                  {position.symbol}
                                </Typography>
                                <Chip 
                                  label={position.type.toUpperCase()} 
                                  size="small" 
                                  color={getPositionTypeColor(position.type) as any}
                                />
                              </Box>
                            }
                            secondary={
                              <Box>
                                <Typography variant="body2">
                                  Amount: ${position.amount.toLocaleString()} | 
                                  Entry: ${position.entryPrice} | 
                                  P&L: <span style={{ color: getPnlColor(position.pnl) }}>
                                    ${position.pnl.toFixed(2)} ({position.pnlPercentage.toFixed(2)}%)
                                  </span>
                                </Typography>
                                {position.vestingSchedule && (
                                  <Typography variant="body2" color="text.secondary">
                                    Vesting: {position.vestingSchedule.claimedAmount.toFixed(2)} / {position.vestingSchedule.totalAmount.toFixed(2)} claimed
                                  </Typography>
                                )}
                              </Box>
                            }
                          />
                        </Box>
                        <ListItemSecondaryAction>
                          <IconButton 
                            edge="end" 
                            onClick={() => closePosition(position.id)}
                            color="error"
                          >
                            ✕
                          </IconButton>
                        </ListItemSecondaryAction>
                      </ListItem>
                    ))}
                  </List>
                )}
              </TabPanel>

              <TabPanel value={activeTab} index={1}>
                <Typography variant="h6" sx={{ marginBottom: '16px' }}>
                  Market Overview
                </Typography>
                {pool ? (
                  <MarketsList pool={pool} />
                ) : (
                  <Box sx={{ textAlign: 'center', padding: '48px' }}>
                    <Typography variant="body1" color="text.secondary">
                      No pool data available
                    </Typography>
                  </Box>
                )}
              </TabPanel>

              <TabPanel value={activeTab} index={2}>
                <Typography variant="h6" sx={{ marginBottom: '16px' }}>
                  Staking Opportunities
                </Typography>
                {pool ? (
                  <StakingMarketList poolId={poolMeta?.id ?? ''} />
                ) : (
                  <Box sx={{ textAlign: 'center', padding: '48px' }}>
                    <Typography variant="body1" color="text.secondary">
                      No staking pools available
                    </Typography>
                  </Box>
                )}
              </TabPanel>

              <TabPanel value={activeTab} index={3}>
                <Typography variant="h6" sx={{ marginBottom: '16px' }}>
                  Vesting Schedules
                </Typography>
                {pool ? (
                  <VestingMarketList poolId={poolMeta?.id ?? ''} />
                ) : (
                  <Box sx={{ textAlign: 'center', padding: '48px' }}>
                    <Typography variant="body1" color="text.secondary">
                      No vesting schedules available
                    </Typography>
                  </Box>
                )}
              </TabPanel>
            </Paper>
          </Grid>
        </Grid>

        {/* Transaction Overview */}
        {simResponse && (
          <Box sx={{ marginTop: '24px' }}>
            <TxOverview>
              <Box sx={{ padding: '16px' }}>
                <Typography variant="body2" color="text.secondary" sx={{ marginBottom: '8px' }}>
                  Transaction Simulation Results
                </Typography>
                {parsedSimResult && (
                  <Typography variant="body2">
                    Simulation completed successfully
                  </Typography>
                )}
              </Box>
            </TxOverview>
          </Box>
        )}
      </Box>
    </Box>
  );
} 