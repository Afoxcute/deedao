import { openaiAPI } from './openai-api';

export interface TokenStakingPosition {
  id: string;
  tokenSymbol: string;
  tokenName: string;
  stakedAmount: number;
  stakedAt: number;
  stakingRewards: number;
  apr: number;
  lockPeriod: number; // in days
  poolAddress: string;
  tokenPrice: number;
  totalValueLocked: number;
}

export interface TokenVestingSchedule {
  id: string;
  tokenSymbol: string;
  tokenName: string;
  totalAmount: number;
  vestedAmount: number;
  vestingStart: number;
  vestingEnd: number;
  cliffPeriod: number; // in days
  vestingType: 'LINEAR' | 'CLIFF' | 'GRADUAL';
  tokenPrice: number;
  beneficiary: string;
}

export interface TokenPool {
  id: string;
  name: string;
  tokenSymbol: string;
  tokenName: string;
  totalValueLocked: number;
  apr: number;
  lockPeriod: number;
  minimumStake: number;
  maximumStake: number;
  poolType: 'LIQUIDITY' | 'STAKING' | 'YIELD_FARMING';
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  tokenPrice: number;
  marketCap: number;
  volume24h: number;
}

export interface TokenMarketData {
  totalValueLocked: number;
  averageAPR: number;
  marketVolatility: number;
  trendingTokens: string[];
  marketSentiment: 'BULLISH' | 'BEARISH' | 'NEUTRAL';
  gasFees: number;
  networkCongestion: 'LOW' | 'MEDIUM' | 'HIGH';
}

export interface TokenRiskAnalysis {
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'EXTREME';
  riskScore: number; // 0-100
  riskFactors: string[];
  recommendations: string[];
  marketConditions: string;
  volatility: number; // 0-100
  impermanentLossRisk?: number; // for liquidity pools
  smartContractRisk: number; // 0-100
  liquidityRisk: number; // 0-100
  tokenSpecificRisks: string[];
}

export interface TokenStrategyRecommendation {
  type: 'TOKEN_STAKING' | 'TOKEN_VESTING' | 'POOL_CREATION' | 'LIQUIDITY_PROVISION';
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
  tokenAllocation: {
    token: string;
    percentage: number;
    reasoning: string;
  }[];
  impermanentLossMitigation?: string[];
  yieldOptimization?: string[];
}

export interface TokenPoolCreationRecommendation {
  poolType: 'LIQUIDITY' | 'STAKING' | 'YIELD_FARMING';
  recommendedAPR: number;
  lockPeriod: number; // in days
  minimumStake: number;
  maximumStake: number;
  riskAssessment: TokenRiskAnalysis;
  marketOpportunity: string;
  competitiveAnalysis: string;
  successMetrics: string[];
  tokenPair?: {
    token1: string;
    token2: string;
    ratio: number;
  };
  liquidityIncentives?: {
    type: string;
    amount: number;
    duration: number;
  }[];
}

export interface TokenUserProfile {
  riskTolerance: 'CONSERVATIVE' | 'MODERATE' | 'AGGRESSIVE';
  investmentHorizon: 'SHORT_TERM' | 'MEDIUM_TERM' | 'LONG_TERM';
  liquidityNeeds: 'HIGH' | 'MEDIUM' | 'LOW';
  experience: 'BEGINNER' | 'INTERMEDIATE' | 'EXPERT';
  portfolioSize: number; // in USD
  goals: string[];
  preferredTokens: string[];
  maxImpermanentLoss: number; // percentage
  yieldTarget: number; // percentage
}

export interface TokenAIRecommendationRequest {
  userProfile: TokenUserProfile;
  currentStakingPositions?: TokenStakingPosition[];
  currentVestingSchedules?: TokenVestingSchedule[];
  availablePools?: TokenPool[];
  marketData?: TokenMarketData;
  requestType: 'TOKEN_STAKING_ANALYSIS' | 'TOKEN_VESTING_ANALYSIS' | 'POOL_CREATION' | 'PORTFOLIO_OPTIMIZATION' | 'LIQUIDITY_ANALYSIS';
}

export interface TokenAIRecommendationResponse {
  riskAnalysis: TokenRiskAnalysis;
  strategyRecommendations: TokenStrategyRecommendation[];
  poolCreationRecommendations?: TokenPoolCreationRecommendation[];
  marketInsights: string[];
  warnings: string[];
  nextSteps: string[];
  confidence: number; // 0-100
  tokenSpecificAdvice: {
    token: string;
    advice: string;
    riskLevel: string;
  }[];
}

// Enhanced OpenAI API call with token-specific prompts
async function callTokenAI(prompt: string): Promise<string> {
  try {
    // Try to use real OpenAI API first
    const response = await openaiAPI.generateRecommendations(prompt);
    console.log('Token AI API response received');
    return response;
  } catch (error) {
    console.warn('Token AI API failed, using mock data:', error);
    // Fallback to mock data
    return generateTokenMockRecommendations(prompt);
  }
}

export async function getTokenAIRecommendations(
  request: TokenAIRecommendationRequest
): Promise<TokenAIRecommendationResponse> {
  try {
    // Build comprehensive prompt for token-specific analysis
    const prompt = buildTokenRecommendationPrompt(request);
    
    // Call OpenAI API with fallback
    const aiResponse = await callTokenAI(prompt);
    
    // Parse and structure the response
    const recommendations = parseTokenAIResponse(aiResponse, request);
    
    return recommendations;
  } catch (error) {
    console.error('Error getting token AI recommendations:', error);
    throw new Error('Failed to generate token AI recommendations');
  }
}

function buildTokenRecommendationPrompt(request: TokenAIRecommendationRequest): string {
  const { userProfile, currentStakingPositions, currentVestingSchedules, availablePools, marketData, requestType } = request;
  
  let prompt = `You are a DeFi investment advisor specializing in token staking, vesting, and liquidity pool creation on blockchain networks. 
  
User Profile:
- Risk Tolerance: ${userProfile.riskTolerance}
- Investment Horizon: ${userProfile.investmentHorizon}
- Liquidity Needs: ${userProfile.liquidityNeeds}
- Experience Level: ${userProfile.experience}
- Portfolio Size: $${userProfile.portfolioSize.toLocaleString()}
- Goals: ${userProfile.goals.join(', ')}
- Preferred Tokens: ${userProfile.preferredTokens.join(', ')}
- Max Impermanent Loss Tolerance: ${userProfile.maxImpermanentLoss}%
- Yield Target: ${userProfile.yieldTarget}%

Request Type: ${requestType}

`;

  if (currentStakingPositions && currentStakingPositions.length > 0) {
    prompt += `Current Token Staking Positions:
${currentStakingPositions.map(pos => `- ${pos.tokenSymbol}: ${pos.stakedAmount} tokens staked at ${pos.apr * 100}% APR, Lock: ${pos.lockPeriod} days, Value: $${(pos.stakedAmount * pos.tokenPrice).toFixed(2)}`).join('\n')}

`;
  }

  if (currentVestingSchedules && currentVestingSchedules.length > 0) {
    prompt += `Current Token Vesting Schedules:
${currentVestingSchedules.map(vest => `- ${vest.tokenSymbol}: ${vest.totalAmount} tokens, ${vest.vestingType} vesting, ${((vest.vestedAmount / vest.totalAmount) * 100).toFixed(1)}% vested`).join('\n')}

`;
  }

  if (availablePools && availablePools.length > 0) {
    prompt += `Available Token Pools:
${availablePools.map(pool => `- ${pool.name} (${pool.tokenSymbol}): ${pool.apr * 100}% APR, TVL: $${pool.totalValueLocked.toLocaleString()}, Risk: ${pool.riskLevel}`).join('\n')}

`;
  }

  if (marketData) {
    prompt += `Token Market Data:
- Total Value Locked: $${marketData.totalValueLocked.toLocaleString()}
- Average APR: ${marketData.averageAPR.toFixed(1)}%
- Market Volatility: ${marketData.marketVolatility}%
- Market Sentiment: ${marketData.marketSentiment}
- Gas Fees: $${marketData.gasFees}
- Network Congestion: ${marketData.networkCongestion}
- Trending Tokens: ${marketData.trendingTokens.join(', ')}

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
    "volatility": 0-100,
    "impermanentLossRisk": 0-100,
    "smartContractRisk": 0-100,
    "liquidityRisk": 0-100,
    "tokenSpecificRisks": ["risk1", "risk2"]
  },
  "strategyRecommendations": [
    {
      "type": "TOKEN_STAKING|TOKEN_VESTING|POOL_CREATION|LIQUIDITY_PROVISION",
      "strategy": "strategy description",
      "reasoning": ["reason1", "reason2"],
      "expectedReturns": {"min": 0, "max": 0, "average": 0},
      "timeHorizon": "description",
      "riskTolerance": "description",
      "liquidityNeeds": "description",
      "tokenAllocation": [
        {
          "token": "TOKEN_SYMBOL",
          "percentage": 0-100,
          "reasoning": "why this token"
        }
      ],
      "impermanentLossMitigation": ["strategy1", "strategy2"],
      "yieldOptimization": ["strategy1", "strategy2"]
    }
  ],
  "marketInsights": ["insight1", "insight2"],
  "warnings": ["warning1", "warning2"],
  "nextSteps": ["step1", "step2"],
  "confidence": 0-100,
  "tokenSpecificAdvice": [
    {
      "token": "TOKEN_SYMBOL",
      "advice": "specific advice for this token",
      "riskLevel": "LOW|MEDIUM|HIGH"
    }
  ]
}

Focus on token-specific risks like impermanent loss, token volatility, smart contract risks, and liquidity considerations. Be conservative in risk assessments and always include appropriate warnings.`;

  return prompt;
}

function parseTokenAIResponse(aiResponse: string, request: TokenAIRecommendationRequest): TokenAIRecommendationResponse {
  try {
    // Try to parse the AI response as JSON
    let parsed;
    try {
      parsed = JSON.parse(aiResponse);
    } catch (parseError) {
      console.warn('Failed to parse token AI response as JSON, using default recommendations');
      return generateDefaultTokenRecommendations(request);
    }
    
    // If the response is a simple message, generate default recommendations
    if (parsed.message) {
      return generateDefaultTokenRecommendations(request);
    }
    
    return {
      riskAnalysis: parsed.riskAnalysis || generateDefaultTokenRiskAnalysis(),
      strategyRecommendations: parsed.strategyRecommendations || generateDefaultTokenStrategyRecommendations(request),
      poolCreationRecommendations: parsed.poolCreationRecommendations,
      marketInsights: parsed.marketInsights || ['Token staking shows strong growth potential'],
      warnings: parsed.warnings || ['Always do your own research before investing'],
      nextSteps: parsed.nextSteps || ['Review token analysis', 'Start with small positions'],
      confidence: parsed.confidence || 75,
      tokenSpecificAdvice: parsed.tokenSpecificAdvice || []
    };
  } catch (error) {
    console.error('Error parsing token AI response:', error);
    return generateDefaultTokenRecommendations(request);
  }
}

function generateDefaultTokenRiskAnalysis(): TokenRiskAnalysis {
  return {
    riskLevel: 'MEDIUM',
    riskScore: 65,
    riskFactors: [
      'Token price volatility',
      'Impermanent loss in liquidity pools',
      'Smart contract risks',
      'Liquidity constraints',
      'Regulatory uncertainty'
    ],
    recommendations: [
      'Diversify across multiple tokens',
      'Consider impermanent loss protection strategies',
      'Monitor token fundamentals regularly',
      'Set clear exit strategies',
      'Use established protocols with audited contracts'
    ],
    marketConditions: 'Moderate volatility with growth potential in token staking',
    volatility: 55,
    impermanentLossRisk: 45,
    smartContractRisk: 30,
    liquidityRisk: 40,
    tokenSpecificRisks: [
      'Token concentration risk',
      'Protocol dependency risk',
      'Yield farming sustainability'
    ]
  };
}

function generateDefaultTokenStrategyRecommendations(request: TokenAIRecommendationRequest): TokenStrategyRecommendation[] {
  const { userProfile } = request;
  
  return [
    {
      type: 'TOKEN_STAKING',
      strategy: 'Conservative token staking with diversification',
      reasoning: [
        'Reduces exposure to single token risk',
        'Provides steady yield generation',
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
      tokenAllocation: [
        {
          token: 'USDC',
          percentage: 40,
          reasoning: 'Stable value preservation'
        },
        {
          token: 'ETH',
          percentage: 30,
          reasoning: 'Growth potential with established track record'
        },
        {
          token: 'BLND',
          percentage: 30,
          reasoning: 'Protocol-specific rewards'
        }
      ],
      impermanentLossMitigation: [
        'Use stable pairs for liquidity provision',
        'Monitor and rebalance positions regularly',
        'Consider single-sided staking for new tokens'
      ],
      yieldOptimization: [
        'Compound rewards regularly',
        'Stake in pools with highest sustainable yields',
        'Monitor for new yield opportunities'
      ]
    }
  ];
}

function generateDefaultTokenRecommendations(request: TokenAIRecommendationRequest): TokenAIRecommendationResponse {
  return {
    riskAnalysis: generateDefaultTokenRiskAnalysis(),
    strategyRecommendations: generateDefaultTokenStrategyRecommendations(request),
    marketInsights: [
      'Token staking shows strong growth potential',
      'Impermanent loss requires careful management',
      'Diversification across tokens is key to risk management'
    ],
    warnings: [
      'Past performance does not guarantee future returns',
      'Impermanent loss can significantly impact returns',
      'Always do your own research',
      'Never invest more than you can afford to lose'
    ],
    nextSteps: [
      'Review token risk analysis',
      'Consider strategy recommendations',
      'Start with small test positions',
      'Monitor market conditions'
    ],
    confidence: 70,
    tokenSpecificAdvice: [
      {
        token: 'USDC',
        advice: 'Consider for stable value preservation and low-risk staking',
        riskLevel: 'LOW'
      },
      {
        token: 'ETH',
        advice: 'Good for growth potential with established fundamentals',
        riskLevel: 'MEDIUM'
      }
    ]
  };
}

// Mock token-specific recommendations
export async function generateTokenMockRecommendations(prompt: string): Promise<string> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Return mock data based on prompt content
  if (prompt.includes('TOKEN_STAKING')) {
    return JSON.stringify({
      riskLevel: 'MEDIUM',
      riskScore: 65,
      riskFactors: [
        'Token price volatility in DeFi sector',
        'Impermanent loss in liquidity pools',
        'Smart contract risks',
        'Liquidity constraints during lock periods'
      ],
      recommendations: [
        'Diversify across multiple tokens',
        'Consider impermanent loss protection',
        'Monitor token fundamentals regularly',
        'Use established protocols'
      ],
      marketConditions: 'Current market shows moderate volatility with strong growth potential in token staking.',
      volatility: 45,
      impermanentLossRisk: 40,
      smartContractRisk: 25,
      liquidityRisk: 35,
      tokenSpecificRisks: [
        'Token concentration risk',
        'Protocol dependency risk'
      ]
    });
  }
  
  if (prompt.includes('LIQUIDITY_PROVISION')) {
    return JSON.stringify({
      type: 'LIQUIDITY_PROVISION',
      strategy: 'Balanced liquidity provision with risk management',
      reasoning: [
        'Provides trading fees and yield farming rewards',
        'Requires careful impermanent loss management',
        'Diversification across multiple pairs reduces risk'
      ],
      expectedReturns: {
        min: 12.0,
        max: 35.0,
        average: 22.5
      },
      timeHorizon: '3-6 months',
      riskTolerance: 'MODERATE',
      liquidityNeeds: 'MEDIUM',
      tokenAllocation: [
        {
          token: 'USDC-ETH',
          percentage: 50,
          reasoning: 'Established pair with lower volatility'
        },
        {
          token: 'BLND-USDC',
          percentage: 30,
          reasoning: 'Protocol-specific rewards'
        },
        {
          token: 'ETH-BLND',
          percentage: 20,
          reasoning: 'Growth potential with higher risk'
        }
      ],
      impermanentLossMitigation: [
        'Use stable pairs for core positions',
        'Monitor and rebalance weekly',
        'Consider single-sided staking for new tokens'
      ],
      yieldOptimization: [
        'Compound rewards daily',
        'Stake LP tokens for additional yield',
        'Monitor for new farming opportunities'
      ]
    });
  }
  
  return JSON.stringify({
    message: 'Token AI recommendation generated successfully',
    timestamp: new Date().toISOString()
  });
}

// Helper function to get real-time token market data
export async function getTokenMarketData(): Promise<TokenMarketData> {
  // In a real implementation, this would fetch from APIs like CoinGecko, etc.
  return {
    totalValueLocked: 2500000,
    averageAPR: 18.5,
    marketVolatility: 55,
    trendingTokens: ['USDC', 'ETH', 'BLND', 'USDT'],
    marketSentiment: 'BULLISH',
    gasFees: 25,
    networkCongestion: 'MEDIUM'
  };
}

// Helper function to analyze user's current token positions
export function analyzeCurrentTokenPositions(
  stakingPositions: TokenStakingPosition[],
  vestingSchedules: TokenVestingSchedule[]
): any {
  const totalStaked = stakingPositions.reduce((sum, pos) => sum + (pos.stakedAmount * pos.tokenPrice), 0);
  const totalVesting = vestingSchedules.reduce((sum, vest) => sum + (vest.totalAmount * vest.tokenPrice), 0);
  const averageStakeAPR = stakingPositions.reduce((sum, pos) => sum + pos.apr, 0) / stakingPositions.length;
  
  return {
    totalStakedValue: totalStaked,
    totalVestingValue: totalVesting,
    averageAPR: averageStakeAPR * 100,
    tokenDiversification: [...new Set([...stakingPositions.map(p => p.tokenSymbol), ...vestingSchedules.map(v => v.tokenSymbol)])],
    positions: stakingPositions.length + vestingSchedules.length
  };
} 