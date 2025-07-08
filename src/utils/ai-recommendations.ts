import { NFTCollection, NFTStakingPosition } from './nft';
import { generateMockRecommendations, openaiAPI } from './openai-api';

export interface RiskAnalysis {
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'EXTREME';
  riskScore: number; // 0-100
  riskFactors: string[];
  recommendations: string[];
  marketConditions: string;
  volatility: number; // 0-100
}

export interface StrategyRecommendation {
  type: 'STAKING' | 'VESTING' | 'POOL_CREATION';
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
  diversification: string[];
}

export interface PoolCreationRecommendation {
  poolType: 'LIQUIDITY' | 'STAKING' | 'YIELD_FARMING' | 'NFT_STAKING';
  recommendedAPR: number;
  lockPeriod: number; // in days
  minimumStake: number;
  maximumStake: number;
  riskAssessment: RiskAnalysis;
  marketOpportunity: string;
  competitiveAnalysis: string;
  successMetrics: string[];
}

export interface UserProfile {
  riskTolerance: 'CONSERVATIVE' | 'MODERATE' | 'AGGRESSIVE';
  investmentHorizon: 'SHORT_TERM' | 'MEDIUM_TERM' | 'LONG_TERM';
  liquidityNeeds: 'HIGH' | 'MEDIUM' | 'LOW';
  experience: 'BEGINNER' | 'INTERMEDIATE' | 'EXPERT';
  portfolioSize: number; // in USD
  goals: string[];
}

export interface AIRecommendationRequest {
  userProfile: UserProfile;
  currentPositions?: NFTStakingPosition[];
  availableCollections?: NFTCollection[];
  marketData?: {
    totalValueLocked: number;
    averageAPR: number;
    marketVolatility: number;
    trendingCollections: string[];
  };
  requestType: 'STAKING_ANALYSIS' | 'VESTING_ANALYSIS' | 'POOL_CREATION' | 'PORTFOLIO_OPTIMIZATION';
}

export interface AIRecommendationResponse {
  riskAnalysis: RiskAnalysis;
  strategyRecommendations: StrategyRecommendation[];
  poolCreationRecommendations?: PoolCreationRecommendation[];
  marketInsights: string[];
  warnings: string[];
  nextSteps: string[];
  confidence: number; // 0-100
}

// Enhanced OpenAI API call with fallback
async function callOpenAI(prompt: string): Promise<string> {
  try {
    // Try to use real OpenAI API first
    const response = await openaiAPI.generateRecommendations(prompt);
    console.log('OpenAI API response received');
    return response;
  } catch (error) {
    console.warn('OpenAI API failed, using mock data:', error);
    // Fallback to mock data
    return generateMockRecommendations(prompt);
  }
}

export async function getAIRecommendations(
  request: AIRecommendationRequest
): Promise<AIRecommendationResponse> {
  try {
    // Build comprehensive prompt for OpenAI
    const prompt = buildRecommendationPrompt(request);
    
    // Call OpenAI API with fallback
    const aiResponse = await callOpenAI(prompt);
    
    // Parse and structure the response
    const recommendations = parseAIResponse(aiResponse, request);
    
    return recommendations;
  } catch (error) {
    console.error('Error getting AI recommendations:', error);
    throw new Error('Failed to generate AI recommendations');
  }
}

function buildRecommendationPrompt(request: AIRecommendationRequest): string {
  const { userProfile, currentPositions, availableCollections, marketData, requestType } = request;
  
  let prompt = `You are a DeFi investment advisor specializing in token staking, vesting, and liquidity pool creation on blockchain networks. 
  
User Profile:
- Risk Tolerance: ${userProfile.riskTolerance}
- Investment Horizon: ${userProfile.investmentHorizon}
- Liquidity Needs: ${userProfile.liquidityNeeds}
- Experience Level: ${userProfile.experience}
- Portfolio Size: $${userProfile.portfolioSize.toLocaleString()}
- Goals: ${userProfile.goals.join(', ')}

Request Type: ${requestType}

`;

  if (currentPositions && currentPositions.length > 0) {
    prompt += `Current Positions:
${currentPositions.map(pos => `- ${pos.metadata?.name || `NFT #${pos.tokenId}`}: Staked ${new Date(pos.stakedAt).toLocaleDateString()}, Rewards: ${Number(pos.stakingRewards) / 1e7}`).join('\n')}

`;
  }

  if (availableCollections && availableCollections.length > 0) {
    prompt += `Available Collections:
${availableCollections.map(col => `- ${col.name}: ${(col.apr * 100).toFixed(1)}% APR`).join('\n')}

`;
  }

  if (marketData) {
    prompt += `Market Data:
- Total Value Locked: $${marketData.totalValueLocked.toLocaleString()}
- Average APR: ${marketData.averageAPR.toFixed(1)}%
- Market Volatility: ${marketData.marketVolatility}%
- Trending Collections: ${marketData.trendingCollections.join(', ')}

`;
  }

  prompt += `Please provide a comprehensive token-focused analysis in the following JSON format:

{
  "riskAnalysis": {
    "riskLevel": "LOW|MEDIUM|HIGH|EXTREME",
    "riskScore": 0-100,
    "riskFactors": ["factor1", "factor2"],
    "recommendations": ["rec1", "rec2"],
    "marketConditions": "description",
    "volatility": 0-100
  },
  "strategyRecommendations": [
    {
      "type": "STAKING|VESTING|POOL_CREATION",
      "strategy": "strategy description",
      "reasoning": ["reason1", "reason2"],
      "expectedReturns": {"min": 0, "max": 0, "average": 0},
      "timeHorizon": "description",
      "riskTolerance": "description",
      "liquidityNeeds": "description",
      "diversification": ["token1", "token2"],
      "impermanentLossMitigation": ["strategy1", "strategy2"],
      "yieldOptimization": ["strategy1", "strategy2"]
    }
  ],
  "marketInsights": ["insight1", "insight2"],
  "warnings": ["warning1", "warning2"],
  "nextSteps": ["step1", "step2"],
  "confidence": 0-100
}

Focus on token-specific risks like impermanent loss, token volatility, smart contract risks, and liquidity considerations. Be conservative in risk assessments and always include appropriate warnings.`;

  return prompt;
}

function parseAIResponse(aiResponse: string, request: AIRecommendationRequest): AIRecommendationResponse {
  try {
    // Try to parse the AI response as JSON
    let parsed;
    try {
      parsed = JSON.parse(aiResponse);
    } catch (parseError) {
      console.warn('Failed to parse AI response as JSON, using default recommendations');
      return generateDefaultRecommendations(request);
    }
    
    // If the response is a simple message, generate default recommendations
    if (parsed.message) {
      return generateDefaultRecommendations(request);
    }
    
    return {
      riskAnalysis: parsed.riskAnalysis || generateDefaultRiskAnalysis(),
      strategyRecommendations: parsed.strategyRecommendations || generateDefaultStrategyRecommendations(request),
      poolCreationRecommendations: parsed.poolCreationRecommendations,
      marketInsights: parsed.marketInsights || ['Market conditions are favorable for NFT staking'],
      warnings: parsed.warnings || ['Always do your own research before investing'],
      nextSteps: parsed.nextSteps || ['Review recommendations', 'Start with small positions'],
      confidence: parsed.confidence || 75
    };
  } catch (error) {
    console.error('Error parsing AI response:', error);
    return generateDefaultRecommendations(request);
  }
}

function generateDefaultRiskAnalysis(): RiskAnalysis {
  return {
    riskLevel: 'MEDIUM',
    riskScore: 60,
    riskFactors: [
      'Market volatility in crypto assets',
      'Smart contract risks',
      'Liquidity constraints',
      'Regulatory uncertainty'
    ],
    recommendations: [
      'Start with small positions',
      'Diversify across multiple assets',
      'Monitor positions regularly',
      'Set clear exit strategies'
    ],
    marketConditions: 'Moderate volatility with growth potential',
    volatility: 50
  };
}

function generateDefaultStrategyRecommendations(request: AIRecommendationRequest): StrategyRecommendation[] {
  const { userProfile } = request;
  
  return [
    {
      type: 'STAKING',
      strategy: 'Conservative staking approach',
      reasoning: [
        'Matches user risk tolerance',
        'Provides steady returns',
        'Allows for gradual portfolio growth'
      ],
      expectedReturns: {
        min: 8.0,
        max: 18.0,
        average: 12.5
      },
      timeHorizon: '6-12 months',
      riskTolerance: userProfile.riskTolerance,
      liquidityNeeds: userProfile.liquidityNeeds,
      diversification: ['Blend Punks', 'Stellar Apes']
    }
  ];
}

function generateDefaultRecommendations(request: AIRecommendationRequest): AIRecommendationResponse {
  return {
    riskAnalysis: generateDefaultRiskAnalysis(),
    strategyRecommendations: generateDefaultStrategyRecommendations(request),
    marketInsights: [
      'NFT staking shows strong growth potential',
      'Market volatility requires careful position sizing',
      'Diversification is key to risk management'
    ],
    warnings: [
      'Past performance does not guarantee future returns',
      'Always do your own research',
      'Never invest more than you can afford to lose'
    ],
    nextSteps: [
      'Review risk analysis',
      'Consider strategy recommendations',
      'Start with small test positions',
      'Monitor market conditions'
    ],
    confidence: 70
  };
}

// Helper function to get real-time market data
export async function getMarketData(): Promise<any> {
  // In a real implementation, this would fetch from APIs like CoinGecko, etc.
  return {
    totalValueLocked: 1250000,
    averageAPR: 15.5,
    marketVolatility: 45,
    trendingCollections: ['Blend Punks', 'Stellar Apes', 'Space Cats']
  };
}

// Helper function to analyze user's current positions
export function analyzeCurrentPositions(positions: NFTStakingPosition[]): any {
  const totalStaked = positions.length;
  const totalRewards = positions.reduce((sum, pos) => sum + pos.stakingRewards, BigInt(0));
  const averageStakeTime = positions.reduce((sum, pos) => sum + (Date.now() - pos.stakedAt), 0) / positions.length;
  
  return {
    totalStaked,
    totalRewards: Number(totalRewards) / 1e7,
    averageStakeTime: averageStakeTime / (24 * 60 * 60 * 1000), // in days
    diversification: positions.map(pos => pos.metadata?.collection).filter(Boolean)
  };
} 