import { Box, Chip, LinearProgress, Typography, useTheme } from '@mui/material';

interface NFTRiskAnalysis {
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'EXTREME';
  riskScore: number; // 0-100
  riskFactors: string[];
  recommendations: string[];
  marketConditions: string;
  volatility: number; // 0-100
  liquidityRisk: number; // 0-100
  smartContractRisk: number; // 0-100
  communityRisk: number; // 0-100
  collectionSpecificRisks: {
    collection: string;
    risks: string[];
    riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  }[];
}

interface NFTRiskAnalysisCardProps {
  riskAnalysis: NFTRiskAnalysis;
}

const getRiskColor = (riskLevel: string) => {
  switch (riskLevel) {
    case 'LOW': return '#4caf50';
    case 'MEDIUM': return '#66BB6A';
    case 'HIGH': return '#f44336';
    case 'EXTREME': return '#9c27b0';
    default: return '#757575';
  }
};

const getRiskDescription = (riskLevel: string) => {
  switch (riskLevel) {
    case 'LOW': return 'Low risk with stable NFT returns';
    case 'MEDIUM': return 'Moderate risk with balanced NFT returns';
    case 'HIGH': return 'High risk with potential for high NFT returns';
    case 'EXTREME': return 'Extreme risk, proceed with caution';
    default: return 'Risk level not determined';
  }
};

export const NFTRiskAnalysisCard: React.FC<NFTRiskAnalysisCardProps> = ({ riskAnalysis }) => {
  const theme = useTheme();
  const riskColor = getRiskColor(riskAnalysis.riskLevel);

  return (
    <Box sx={{
      backgroundColor: theme.palette.background.paper,
      borderRadius: '12px',
      padding: '24px',
      border: `1px solid ${theme.palette.divider}`,
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
    }}>
      <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: '24px' }}>
        <Typography variant="h3" sx={{ marginRight: '16px' }}>
          🎨 NFT Risk Analysis
        </Typography>
        <Chip
          label={riskAnalysis.riskLevel}
          sx={{
            backgroundColor: riskColor,
            color: 'white',
            fontWeight: 'bold',
            fontSize: '14px'
          }}
        />
      </Box>

      <Typography variant="body1" color="text.secondary" sx={{ marginBottom: '16px' }}>
        {getRiskDescription(riskAnalysis.riskLevel)}
      </Typography>

      {/* Overall Risk Score */}
      <Box sx={{ marginBottom: '24px' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
          <Typography variant="body2">Overall NFT Risk Score</Typography>
          <Typography variant="body2" fontWeight="bold">
            {riskAnalysis.riskScore}/100
          </Typography>
        </Box>
        <LinearProgress
          variant="determinate"
          value={riskAnalysis.riskScore}
          sx={{
            height: 8,
            borderRadius: 4,
            backgroundColor: theme.palette.action.hover,
            '& .MuiLinearProgress-bar': {
              backgroundColor: riskColor
            }
          }}
        />
      </Box>

      {/* NFT-Specific Risk Metrics */}
      <Box sx={{ marginBottom: '24px' }}>
        <Typography variant="h5" sx={{ marginBottom: '16px' }}>
          NFT-Specific Risk Metrics
        </Typography>
        
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 2 }}>
          {/* Market Volatility */}
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <Typography variant="body2">Market Volatility</Typography>
              <Typography variant="body2" fontWeight="bold">
                {riskAnalysis.volatility}%
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={riskAnalysis.volatility}
              sx={{
                height: 6,
                borderRadius: 3,
                backgroundColor: theme.palette.action.hover,
                '& .MuiLinearProgress-bar': {
                  backgroundColor: theme.palette.warning.main
                }
              }}
            />
          </Box>

          {/* Smart Contract Risk */}
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <Typography variant="body2">Smart Contract Risk</Typography>
              <Typography variant="body2" fontWeight="bold">
                {riskAnalysis.smartContractRisk}%
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={riskAnalysis.smartContractRisk}
              sx={{
                height: 6,
                borderRadius: 3,
                backgroundColor: theme.palette.action.hover,
                '& .MuiLinearProgress-bar': {
                  backgroundColor: theme.palette.error.main
                }
              }}
            />
          </Box>

          {/* Liquidity Risk */}
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <Typography variant="body2">Liquidity Risk</Typography>
              <Typography variant="body2" fontWeight="bold">
                {riskAnalysis.liquidityRisk}%
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={riskAnalysis.liquidityRisk}
              sx={{
                height: 6,
                borderRadius: 3,
                backgroundColor: theme.palette.action.hover,
                '& .MuiLinearProgress-bar': {
                  backgroundColor: theme.palette.info.main
                }
              }}
            />
          </Box>

          {/* Community Risk */}
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <Typography variant="body2">Community Risk</Typography>
              <Typography variant="body2" fontWeight="bold">
                {riskAnalysis.communityRisk}%
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={riskAnalysis.communityRisk}
              sx={{
                height: 6,
                borderRadius: 3,
                backgroundColor: theme.palette.action.hover,
                '& .MuiLinearProgress-bar': {
                  backgroundColor: theme.palette.secondary.main
                }
              }}
            />
          </Box>
        </Box>
      </Box>

      {/* Market Conditions */}
      <Box sx={{ marginBottom: '24px' }}>
        <Typography variant="h5" sx={{ marginBottom: '12px' }}>
          NFT Market Conditions
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {riskAnalysis.marketConditions}
        </Typography>
      </Box>

      {/* Collection-Specific Risks */}
      {riskAnalysis.collectionSpecificRisks.length > 0 && (
        <Box sx={{ marginBottom: '24px' }}>
          <Typography variant="h5" sx={{ marginBottom: '12px' }}>
            Collection-Specific Risks
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {riskAnalysis.collectionSpecificRisks.map((collectionRisk, index) => (
              <Box
                key={index}
                sx={{
                  padding: '16px',
                  backgroundColor: theme.palette.action.hover,
                  borderRadius: '8px',
                  border: `1px solid ${theme.palette.divider}`
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                  <Typography variant="h6" sx={{ marginRight: '12px' }}>
                    {collectionRisk.collection}
                  </Typography>
                  <Chip
                    label={collectionRisk.riskLevel}
                    size="small"
                    sx={{
                      backgroundColor: getRiskColor(collectionRisk.riskLevel),
                      color: 'white',
                      fontWeight: 'bold'
                    }}
                  />
                </Box>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {collectionRisk.risks.map((risk, riskIndex) => (
                    <Chip
                      key={riskIndex}
                      label={risk}
                      size="small"
                      variant="outlined"
                      sx={{ borderColor: theme.palette.error.main, color: theme.palette.error.main }}
                    />
                  ))}
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
      )}

      {/* General Risk Factors */}
      <Box sx={{ marginBottom: '24px' }}>
        <Typography variant="h5" sx={{ marginBottom: '12px' }}>
          Key NFT Risk Factors
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {riskAnalysis.riskFactors.map((factor, index) => (
            <Chip
              key={index}
              label={factor}
              size="small"
              variant="outlined"
              sx={{ borderColor: theme.palette.error.main, color: theme.palette.error.main }}
            />
          ))}
        </Box>
      </Box>

      {/* Risk Mitigation Recommendations */}
      <Box>
        <Typography variant="h5" sx={{ marginBottom: '12px' }}>
          NFT Risk Mitigation Recommendations
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          {riskAnalysis.recommendations.map((recommendation, index) => (
            <Box
              key={index}
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
                {recommendation}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
}; 