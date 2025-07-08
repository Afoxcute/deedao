import { ArrowForward, CheckCircle, TrendingUp, Warning } from '@mui/icons-material';
import { Alert, Box, Typography, useTheme } from '@mui/material';

interface MarketInsightsCardProps {
  insights: string[];
  warnings: string[];
  nextSteps: string[];
}

export const MarketInsightsCard: React.FC<MarketInsightsCardProps> = ({ 
  insights, 
  warnings, 
  nextSteps 
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
        Market Insights & Action Plan
      </Typography>

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

      {/* Disclaimer */}
      <Box sx={{ 
        marginTop: '24px', 
        padding: '16px', 
        backgroundColor: theme.palette.background.default,
        borderRadius: '8px',
        border: `1px solid ${theme.palette.divider}`
      }}>
        <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
          <strong>Disclaimer:</strong> These recommendations are generated by AI and should not be considered as financial advice. 
          Always conduct your own research and consider consulting with a financial advisor before making investment decisions. 
          Past performance does not guarantee future results.
        </Typography>
      </Box>
    </Box>
  );
}; 