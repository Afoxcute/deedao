import { Alert, Box, Button, CircularProgress, Typography, useTheme } from '@mui/material';
import { useState } from 'react';
import { NFTCollection, NFTStakingPosition, NFTVestingSchedule } from '../../utils/nft';
import { getNFTAIRecommendations, NFTAIRecommendationRequest, NFTAIRecommendationResponse, NFTUserProfile } from '../../utils/nft-ai-recommendations';
import { NFTMarketInsightsCard } from './NFTMarketInsightsCard';
import { NFTRiskAnalysisCard } from './NFTRiskAnalysisCard';
import { NFTStrategyRecommendationsCard } from './NFTStrategyRecommendationsCard';
import { NFTUserProfileForm } from './NFTUserProfileForm';

interface NFTAIRecommendationPanelProps {
  currentStakingPositions?: NFTStakingPosition[];
  currentVestingSchedules?: NFTVestingSchedule[];
  availableCollections?: NFTCollection[];
  requestType: 'NFT_STAKING_ANALYSIS' | 'NFT_VESTING_ANALYSIS' | 'NFT_POOL_CREATION' | 'NFT_PORTFOLIO_OPTIMIZATION';
}

export const NFTAIRecommendationPanel: React.FC<NFTAIRecommendationPanelProps> = ({
  currentStakingPositions,
  currentVestingSchedules,
  availableCollections,
  requestType
}) => {
  const theme = useTheme();
  const [userProfile, setUserProfile] = useState<NFTUserProfile | null>(null);
  const [recommendations, setRecommendations] = useState<NFTAIRecommendationResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateRecommendations = async (profile: NFTUserProfile) => {
    setIsLoading(true);
    setError(null);
    setUserProfile(profile);

    try {
      const request: NFTAIRecommendationRequest = {
        userProfile: profile,
        currentStakingPositions,
        currentVestingSchedules,
        availableCollections,
        requestType
      };

      const aiResponse = await getNFTAIRecommendations(request);
      setRecommendations(aiResponse);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate NFT recommendations');
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
        🎨 NFT AI Investment Advisor
      </Typography>
      
      <Typography variant="body1" color="text.secondary" sx={{ marginBottom: '32px', textAlign: 'center' }}>
        Get personalized AI-powered recommendations for your NFT staking, vesting, and stake pool creation strategies.
        Our AI analyzes market conditions, your risk profile, and current NFT positions to provide tailored advice.
      </Typography>

      {!userProfile ? (
        <NFTUserProfileForm onSubmit={handleGenerateRecommendations} />
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
                Analyzing Your NFT Portfolio...
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Our AI is analyzing market conditions, your risk profile, and current NFT positions
              </Typography>
            </Box>
          ) : recommendations ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {/* NFT Risk Analysis */}
              <NFTRiskAnalysisCard riskAnalysis={recommendations.riskAnalysis} />
              
              {/* NFT Strategy Recommendations */}
              <NFTStrategyRecommendationsCard 
                recommendations={recommendations.strategyRecommendations}
                confidence={recommendations.confidence}
              />
              
              {/* NFT Market Insights */}
              <NFTMarketInsightsCard 
                insights={recommendations.marketInsights}
                warnings={recommendations.warnings}
                nextSteps={recommendations.nextSteps}
                collectionSpecificAdvice={recommendations.collectionSpecificAdvice}
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