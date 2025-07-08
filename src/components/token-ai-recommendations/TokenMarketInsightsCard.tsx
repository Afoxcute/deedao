import { ArrowForward, CheckCircle, TrendingUp, Warning } from '@mui/icons-material';
import { Alert, Box, Chip, Typography, useTheme } from '@mui/material';

interface TokenSpecificAdvice {
  token: string;
  advice: string;
  riskLevel: string;
}

interface TokenMarketInsightsCardProps {
  insights: string[];
  warnings: string[];
  nextSteps: string[];
  tokenSpecificAdvice: TokenSpecificAdvice[];
}

export const TokenMarketInsightsCard: React.FC<TokenMarketInsightsCardProps> = ({ 
  insights, 
  warnings, 
  nextSteps,
  tokenSpecificAdvice
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
      <Typography variant="h3" sx={{ marginBottom: '24px' }}>
        Token Market Insights & Action Plan
      </Typography>

      {/* Token-Specific Advice */}
      {tokenSpecificAdvice.length > 0 && (
        <Box sx={{ marginBottom: '24px' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
            <CheckCircle sx={{ marginRight: '8px', color: theme.palette.success.main }} />
            <Typography variant="h5">
              Token-Specific Recommendations
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {tokenSpecificAdvice.map((advice, index) => (
              <Alert
                key={index}
                severity={advice.riskLevel === 'HIGH' ? 'warning' : 'info'}
                sx={{
                  '& .MuiAlert-message': {
                    width: '100%'
                  }
                }}
              >
                <Box>
                  <Typography variant="body1" fontWeight="bold" sx={{ marginBottom: '4px' }}>
                    {advice.token}
                  </Typography>
                  <Typography variant="body2">
                    {advice.advice}
                  </Typography>
                  <Chip
                    label={`Risk: ${advice.riskLevel}`}
                    size="small"
                    sx={{
                      marginTop: '8px',
                      backgroundColor: advice.riskLevel === 'HIGH' ? theme.palette.warning.main : 
                                     advice.riskLevel === 'MEDIUM' ? theme.palette.info.main : 
                                     theme.palette.success.main,
                      color: 'white'
                    }}
                  />
                </Box>
              </Alert>
            ))}
          </Box>
        </Box>
      )}

      {/* Market Insights */}
      {insights.length > 0 && (
        <Box sx={{ marginBottom: '24px' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
            <TrendingUp sx={{ marginRight: '8px', color: theme.palette.success.main }} />
            <Typography variant="h5">
              Market Insights
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {insights.map((insight, index) => (
              <Alert
                key={index}
                severity="info"
                sx={{
                  '& .MuiAlert-message': {
                    width: '100%'
                  }
                }}
              >
                <Typography variant="body2">
                  {insight}
                </Typography>
              </Alert>
            ))}
          </Box>
        </Box>
      )}

      {/* Warnings */}
      {warnings.length > 0 && (
        <Box sx={{ marginBottom: '24px' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
            <Warning sx={{ marginRight: '8px', color: theme.palette.warning.main }} />
            <Typography variant="h5">
              Important Warnings
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {warnings.map((warning, index) => (
              <Alert
                key={index}
                severity="warning"
                sx={{
                  '& .MuiAlert-message': {
                    width: '100%'
                  }
                }}
              >
                <Typography variant="body2">
                  {warning}
                </Typography>
              </Alert>
            ))}
          </Box>
        </Box>
      )}

      {/* Next Steps */}
      {nextSteps.length > 0 && (
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
            <CheckCircle sx={{ marginRight: '8px', color: theme.palette.success.main }} />
            <Typography variant="h5">
              Recommended Next Steps
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {nextSteps.map((step, index) => (
              <Box
                key={index}
                sx={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 2,
                  padding: '16px',
                  backgroundColor: theme.palette.action.hover,
                  borderRadius: '8px',
                  border: `1px solid ${theme.palette.divider}`
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 24,
                    height: 24,
                    borderRadius: '50%',
                    backgroundColor: theme.palette.primary.main,
                    color: 'white',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    flexShrink: 0,
                    marginTop: '2px'
                  }}
                >
                  {index + 1}
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="body1" sx={{ marginBottom: '4px' }}>
                    {step}
                  </Typography>
                </Box>
                <ArrowForward 
                  sx={{ 
                    color: theme.palette.primary.main,
                    marginTop: '2px',
                    flexShrink: 0
                  }} 
                />
              </Box>
            ))}
          </Box>
        </Box>
      )}

      {/* Token-Specific Disclaimer */}
      <Box sx={{ 
        marginTop: '24px', 
        padding: '16px', 
        backgroundColor: theme.palette.background.default,
        borderRadius: '8px',
        border: `1px solid ${theme.palette.divider}`
      }}>
        <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
          <strong>Token Investment Disclaimer:</strong> These recommendations are generated by AI and should not be considered as financial advice. 
          Token investments carry significant risks including impermanent loss, volatility, and smart contract risks. 
          Always conduct your own research and consider consulting with a financial advisor before making investment decisions. 
          Past performance does not guarantee future results.
        </Typography>
      </Box>
    </Box>
  );
}; 