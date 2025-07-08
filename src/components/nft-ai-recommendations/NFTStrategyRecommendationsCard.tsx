import { ExpandMore } from '@mui/icons-material';
import { Accordion, AccordionDetails, AccordionSummary, Box, Chip, LinearProgress, Typography, useTheme } from '@mui/material';

interface NFTAllocation {
  collection: string;
  percentage: number;
  reasoning: string;
}

interface NFTStrategyRecommendation {
  type: 'NFT_STAKING' | 'NFT_VESTING' | 'POOL_CREATION' | 'COLLECTION_DIVERSIFICATION';
  strategy: string;
  reasoning: string[];
  expectedReturns: {
    min: number;
    max: number;
    average: number;
  };
  timeHorizon: string;
  riskTolerance: string;
  liquidityNeeds: string;
  nftAllocation: NFTAllocation[];
  impermanentLossMitigation?: string[];
  yieldOptimization?: string[];
}

interface NFTStrategyRecommendationsCardProps {
  recommendations: NFTStrategyRecommendation[];
  confidence: number;
}

const getStrategyIcon = (type: string) => {
  switch (type) {
    case 'NFT_STAKING': return '🔒';
    case 'NFT_VESTING': return '⏰';
    case 'POOL_CREATION': return '🏊';
    case 'COLLECTION_DIVERSIFICATION': return '🎨';
    default: return '📊';
  }
};

const getStrategyColor = (type: string) => {
  switch (type) {
    case 'NFT_STAKING': return '#4caf50';
    case 'NFT_VESTING': return '#66BB6A';
    case 'POOL_CREATION': return '#2196f3';
    case 'COLLECTION_DIVERSIFICATION': return '#9c27b0';
    default: return '#757575';
  }
};

export const NFTStrategyRecommendationsCard: React.FC<NFTStrategyRecommendationsCardProps> = ({ 
  recommendations, 
  confidence 
}) => {
  const theme = useTheme();

  return (
    <Box sx={{
      backgroundColor: theme.palette.background.paper,
      borderRadius: '12px',
      padding: '24px',
      border: `1px solid ${theme.palette.divider}`,
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
    }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <Typography variant="h3">
          🎨 NFT Strategy Recommendations
        </Typography>
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            AI Confidence
          </Typography>
          <Typography variant="h4" color="primary.main">
            {confidence}%
          </Typography>
        </Box>
      </Box>

      <Box sx={{ marginBottom: '24px' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
          <Typography variant="body2">Confidence Level</Typography>
          <Typography variant="body2" fontWeight="bold">
            {confidence}%
          </Typography>
        </Box>
        <LinearProgress
          variant="determinate"
          value={confidence}
          sx={{
            height: 8,
            borderRadius: 4,
            backgroundColor: theme.palette.action.hover,
            '& .MuiLinearProgress-bar': {
              backgroundColor: theme.palette.success.main
            }
          }}
        />
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {recommendations.map((recommendation, index) => (
          <Accordion key={index} sx={{ border: `1px solid ${theme.palette.divider}` }}>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
                <Typography variant="h4" sx={{ fontSize: '24px' }}>
                  {getStrategyIcon(recommendation.type)}
                </Typography>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h5" sx={{ marginBottom: '4px' }}>
                    {recommendation.strategy}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    <Chip
                      label={recommendation.type.replace(/_/g, ' ')}
                      size="small"
                      sx={{
                        backgroundColor: getStrategyColor(recommendation.type),
                        color: 'white',
                        fontWeight: 'bold'
                      }}
                    />
                    <Chip
                      label={`${recommendation.expectedReturns.average.toFixed(1)}% Avg Return`}
                      size="small"
                      variant="outlined"
                    />
                    <Chip
                      label={recommendation.timeHorizon}
                      size="small"
                      variant="outlined"
                    />
                  </Box>
                </Box>
              </Box>
            </AccordionSummary>
            
            <AccordionDetails>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                {/* Expected Returns */}
                <Box>
                  <Typography variant="h6" sx={{ marginBottom: '12px' }}>
                    Expected Returns
                  </Typography>
                  <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 2 }}>
                    <Box sx={{ textAlign: 'center', padding: '12px', backgroundColor: theme.palette.action.hover, borderRadius: '8px' }}>
                      <Typography variant="h5" color="error.main">
                        {recommendation.expectedReturns.min.toFixed(1)}%
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Minimum
                      </Typography>
                    </Box>
                    <Box sx={{ textAlign: 'center', padding: '12px', backgroundColor: theme.palette.action.hover, borderRadius: '8px' }}>
                      <Typography variant="h5" color="primary.main">
                        {recommendation.expectedReturns.average.toFixed(1)}%
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Average
                      </Typography>
                    </Box>
                    <Box sx={{ textAlign: 'center', padding: '12px', backgroundColor: theme.palette.action.hover, borderRadius: '8px' }}>
                      <Typography variant="h5" color="success.main">
                        {recommendation.expectedReturns.max.toFixed(1)}%
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Maximum
                      </Typography>
                    </Box>
                  </Box>
                </Box>

                {/* NFT Allocation */}
                {recommendation.nftAllocation && recommendation.nftAllocation.length > 0 && (
                  <Box>
                    <Typography variant="h6" sx={{ marginBottom: '12px' }}>
                      Recommended NFT Collection Allocation
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                      {recommendation.nftAllocation.map((allocation, allocIndex) => (
                        <Box
                          key={allocIndex}
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '12px',
                            backgroundColor: theme.palette.action.hover,
                            borderRadius: '8px'
                          }}
                        >
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Chip
                              label={allocation.collection}
                              size="small"
                              sx={{ backgroundColor: theme.palette.primary.main, color: 'white' }}
                            />
                            <Typography variant="body2">
                              {allocation.reasoning}
                            </Typography>
                          </Box>
                          <Typography variant="body2" fontWeight="bold">
                            {allocation.percentage}%
                          </Typography>
                        </Box>
                      ))}
                    </Box>
                  </Box>
                )}

                {/* Impermanent Loss Mitigation */}
                {recommendation.impermanentLossMitigation && recommendation.impermanentLossMitigation.length > 0 && (
                  <Box>
                    <Typography variant="h6" sx={{ marginBottom: '12px' }}>
                      Impermanent Loss Mitigation
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                      {recommendation.impermanentLossMitigation.map((strategy, stratIndex) => (
                        <Box
                          key={stratIndex}
                          sx={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: 2,
                            padding: '12px',
                            backgroundColor: theme.palette.action.hover,
                            borderRadius: '8px'
                          }}
                        >
                          <Box
                            sx={{
                              width: 6,
                              height: 6,
                              borderRadius: '50%',
                              backgroundColor: theme.palette.warning.main,
                              marginTop: '6px',
                              flexShrink: 0
                            }}
                          />
                          <Typography variant="body2">
                            {strategy}
                          </Typography>
                        </Box>
                      ))}
                    </Box>
                  </Box>
                )}

                {/* Yield Optimization */}
                {recommendation.yieldOptimization && recommendation.yieldOptimization.length > 0 && (
                  <Box>
                    <Typography variant="h6" sx={{ marginBottom: '12px' }}>
                      NFT Yield Optimization Strategies
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                      {recommendation.yieldOptimization.map((strategy, stratIndex) => (
                        <Box
                          key={stratIndex}
                          sx={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: 2,
                            padding: '12px',
                            backgroundColor: theme.palette.action.hover,
                            borderRadius: '8px'
                          }}
                        >
                          <Box
                            sx={{
                              width: 6,
                              height: 6,
                              borderRadius: '50%',
                              backgroundColor: theme.palette.success.main,
                              marginTop: '6px',
                              flexShrink: 0
                            }}
                          />
                          <Typography variant="body2">
                            {strategy}
                          </Typography>
                        </Box>
                      ))}
                    </Box>
                  </Box>
                )}

                {/* Reasoning */}
                <Box>
                  <Typography variant="h6" sx={{ marginBottom: '12px' }}>
                    Why This NFT Strategy?
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    {recommendation.reasoning.map((reason, reasonIndex) => (
                      <Box
                        key={reasonIndex}
                        sx={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: 2,
                          padding: '12px',
                          backgroundColor: theme.palette.action.hover,
                          borderRadius: '8px'
                        }}
                      >
                        <Box
                          sx={{
                            width: 6,
                            height: 6,
                            borderRadius: '50%',
                            backgroundColor: theme.palette.info.main,
                            marginTop: '6px',
                            flexShrink: 0
                          }}
                        />
                        <Typography variant="body2">
                          {reason}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                </Box>

                {/* Strategy Details */}
                <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 2 }}>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Risk Tolerance
                    </Typography>
                    <Typography variant="body1" fontWeight="bold">
                      {recommendation.riskTolerance}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Liquidity Needs
                    </Typography>
                    <Typography variant="body1" fontWeight="bold">
                      {recommendation.liquidityNeeds}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Time Horizon
                    </Typography>
                    <Typography variant="body1" fontWeight="bold">
                      {recommendation.timeHorizon}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </AccordionDetails>
          </Accordion>
        ))}
      </Box>
    </Box>
  );
}; 