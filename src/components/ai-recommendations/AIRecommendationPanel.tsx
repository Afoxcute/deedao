import { Alert, Box, Button, CircularProgress, Typography, useTheme } from '@mui/material';
import { useState } from 'react';
import { AIRecommendationRequest, AIRecommendationResponse, getAIRecommendations, UserProfile } from '../../utils/ai-recommendations';
import { NFTCollection, NFTStakingPosition } from '../../utils/nft';
import { MarketInsightsCard } from './MarketInsightsCard';
import { RiskAnalysisCard } from './RiskAnalysisCard';
import { StrategyRecommendationsCard } from './StrategyRecommendationsCard';
import { UserProfileForm } from './UserProfileForm';

interface AIRecommendationPanelProps {
  currentPositions?: NFTStakingPosition[];
  availableCollections?: NFTCollection[];
  requestType: 'STAKING_ANALYSIS' | 'VESTING_ANALYSIS' | 'POOL_CREATION' | 'PORTFOLIO_OPTIMIZATION';
}

export const AIRecommendationPanel: React.FC<AIRecommendationPanelProps> = ({
  currentPositions,
  availableCollections,
  requestType
}) => {
  const theme = useTheme();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [recommendations, setRecommendations] = useState<AIRecommendationResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateRecommendations = async (profile: UserProfile) => {
    setIsLoading(true);
    setError(null);
    setUserProfile(profile);

    try {
      const request: AIRecommendationRequest = {
        userProfile: profile,
        currentPositions,
        availableCollections,
        requestType
      };

      const aiResponse = await getAIRecommendations(request);
      setRecommendations(aiResponse);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate recommendations');
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
        🤖 AI Investment Advisor
      </Typography>
      
      <Typography variant="body1" color="text.secondary" sx={{ marginBottom: '32px', textAlign: 'center' }}>
        Get personalized risk analysis and strategy recommendations for your NFT staking, vesting, and pool creation decisions.
      </Typography>

      {!userProfile ? (
        <UserProfileForm onSubmit={handleGenerateRecommendations} />
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
                Analyzing Your Portfolio...
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Our AI is analyzing market conditions, your risk profile, and current positions
              </Typography>
            </Box>
          ) : recommendations ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {/* Risk Analysis */}
              <RiskAnalysisCard riskAnalysis={recommendations.riskAnalysis} />
              
              {/* Strategy Recommendations */}
              <StrategyRecommendationsCard 
                recommendations={recommendations.strategyRecommendations}
                confidence={recommendations.confidence}
              />
              
              {/* Market Insights */}
              <MarketInsightsCard 
                insights={recommendations.marketInsights}
                warnings={recommendations.warnings}
                nextSteps={recommendations.nextSteps}
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