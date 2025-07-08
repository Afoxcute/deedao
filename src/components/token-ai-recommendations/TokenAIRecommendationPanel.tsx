import { Alert, Box, Button, CircularProgress, Typography, useTheme } from '@mui/material';
import { useState } from 'react';
import { getTokenAIRecommendations, TokenAIRecommendationRequest, TokenAIRecommendationResponse, TokenPool, TokenStakingPosition, TokenUserProfile, TokenVestingSchedule } from '../../utils/token-ai-recommendations';
import { TokenMarketInsightsCard } from './TokenMarketInsightsCard';
import { TokenRiskAnalysisCard } from './TokenRiskAnalysisCard';
import { TokenStrategyRecommendationsCard } from './TokenStrategyRecommendationsCard';
import { TokenUserProfileForm } from './TokenUserProfileForm';

interface TokenAIRecommendationPanelProps {
  currentStakingPositions?: TokenStakingPosition[];
  currentVestingSchedules?: TokenVestingSchedule[];
  availablePools?: TokenPool[];
  requestType: 'TOKEN_STAKING_ANALYSIS' | 'TOKEN_VESTING_ANALYSIS' | 'POOL_CREATION' | 'PORTFOLIO_OPTIMIZATION' | 'LIQUIDITY_ANALYSIS';
}

export const TokenAIRecommendationPanel: React.FC<TokenAIRecommendationPanelProps> = ({
  currentStakingPositions,
  currentVestingSchedules,
  availablePools,
  requestType
}) => {
  const theme = useTheme();
  const [userProfile, setUserProfile] = useState<TokenUserProfile | null>(null);
  const [recommendations, setRecommendations] = useState<TokenAIRecommendationResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateRecommendations = async (profile: TokenUserProfile) => {
    setIsLoading(true);
    setError(null);
    setUserProfile(profile);

    try {
      const request: TokenAIRecommendationRequest = {
        userProfile: profile,
        currentStakingPositions,
        currentVestingSchedules,
        availablePools,
        requestType
      };

      const aiResponse = await getTokenAIRecommendations(request);
      setRecommendations(aiResponse);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate token recommendations');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefreshRecommendations = async () => {
    if (!userProfile) return;
    await handleGenerateRecommendations(userProfile);
  };

  return (
    <Box sx={{ width: '100%', maxWidth: '1200px', margin: '0 auto', padding: '24px' }}>
      <Typography variant="h1" sx={{ marginBottom: '24px', textAlign: 'center' }}>
        🪙 Token AI Investment Advisor
      </Typography>
      
      <Typography variant="body1" color="text.secondary" sx={{ marginBottom: '32px', textAlign: 'center' }}>
        Get personalized AI-powered recommendations for your token staking, vesting, and liquidity pool strategies.
      </Typography>

      {!userProfile ? (
        <TokenUserProfileForm onSubmit={handleGenerateRecommendations} />
      ) : (
        <Box>
          {error && (
            <Alert severity="error" sx={{ marginBottom: '24px' }}>
              {error}
            </Alert>
          )}

          {isLoading ? (
            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              padding: '48px' 
            }}>
              <CircularProgress size={60} sx={{ marginBottom: '16px' }} />
              <Typography variant="h4" sx={{ marginBottom: '8px' }}>
                Analyzing Your Token Portfolio...
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Our AI is analyzing market conditions, your risk profile, and current token positions
              </Typography>
            </Box>
          ) : recommendations ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {/* Token Risk Analysis */}
              <TokenRiskAnalysisCard riskAnalysis={recommendations.riskAnalysis} />
              
              {/* Token Strategy Recommendations */}
              <TokenStrategyRecommendationsCard 
                recommendations={recommendations.strategyRecommendations}
                confidence={recommendations.confidence}
              />
              
              {/* Token Market Insights */}
              <TokenMarketInsightsCard 
                insights={recommendations.marketInsights}
                warnings={recommendations.warnings}
                nextSteps={recommendations.nextSteps}
                tokenSpecificAdvice={recommendations.tokenSpecificAdvice}
              />
              
              {/* Refresh Button */}
              <Box sx={{ textAlign: 'center', marginTop: '24px' }}>
                <Button
                  variant="outlined"
                  onClick={handleRefreshRecommendations}
                  disabled={isLoading}
                  sx={{ marginRight: 2 }}
                >
                  Refresh Recommendations
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => setUserProfile(null)}
                >
                  Update Profile
                </Button>
              </Box>
            </Box>
          ) : null}
        </Box>
      )}
    </Box>
  );
}; 