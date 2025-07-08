import { NFTCollection, NFTStakingPosition, NFTVestingSchedule } from './nft';
import { openaiAPI } from './openai-api';

export interface NFTStakingAnalysis {
  tokenId: string;
  collectionName: string;
  stakedAt: number;
  currentRewards: bigint;
  lockPeriod: number;
  isLocked: boolean;
  apr: number;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  marketValue: number;
  potentialReturns: number;
}

export interface NFTVestingAnalysis {
  tokenId: string;
  collectionName: string;
  totalAmount: bigint;
  claimedAmount: bigint;
  vestingProgress: number; // 0-100
  timeUntilCliff: number; // in days
  timeUntilFullyVested: number; // in days
  currentValue: number;
  potentialValue: number;
  riskFactors: string[];
}

export interface NFTPoolCreationAnalysis {
  collectionName: string;
  totalSupply: number;
  floorPrice: number;
  volume24h: number;
  marketCap: number;
  communitySize: number;
  utilityScore: number; // 0-100
  riskAssessment: {
    marketRisk: number; // 0-100
    liquidityRisk: number; // 0-100
    smartContractRisk: number; // 0-100
    communityRisk: number; // 0-100
  };
  poolRecommendation: {
    recommendedAPR: number;
    lockPeriod: number;
    minimumStake: number;
    maximumStake: number;
    successProbability: number; // 0-100
  };
}

export interface NFTMarketData {
  totalNFTsStaked: number;
  averageAPR: number;
  marketVolatility: number;
  trendingCollections: string[];
  marketSentiment: 'BULLISH' | 'BEARISH' | 'NEUTRAL';
  gasFees: number;
  networkCongestion: 'LOW' | 'MEDIUM' | 'HIGH';
  floorPriceTrends: {
    collection: string;
    trend: 'UP' | 'DOWN' | 'STABLE';
    percentageChange: number;
  }[];
}

export interface NFTRiskAnalysis {
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

export interface NFTStrategyRecommendation {
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
  nftAllocation: {
    collection: string;
    percentage: number;
    reasoning: string;
  }[];
  impermanentLossMitigation?: string[];
  yieldOptimization?: string[];
}

export interface NFTPoolCreationRecommendation {
  collectionName: string;
  recommendedAPR: number;
  lockPeriod: number; // in days
  minimumStake: number;
  maximumStake: number;
  riskAssessment: NFTRiskAnalysis;
  marketOpportunity: string;
  competitiveAnalysis: string;
  successMetrics: string[];
  communityIncentives?: {
    type: string;
    amount: number;
    duration: number;
  }[];
  marketingStrategy?: string[];
}

export interface NFTUserProfile {
  riskTolerance: 'CONSERVATIVE' | 'MODERATE' | 'AGGRESSIVE';
  investmentHorizon: 'SHORT_TERM' | 'MEDIUM_TERM' | 'LONG_TERM';
  liquidityNeeds: 'HIGH' | 'MEDIUM' | 'LOW';
  experience: 'BEGINNER' | 'INTERMEDIATE' | 'EXPERT';
  portfolioSize: number; // in USD
  goals: string[];
  preferredCollections: string[];
  maxImpermanentLoss: number; // percentage
  yieldTarget: number; // percentage
  nftKnowledge: 'NOVICE' | 'INTERMEDIATE' | 'EXPERT';
}

export interface NFTAIRecommendationRequest {
  userProfile: NFTUserProfile;
  currentStakingPositions?: NFTStakingPosition[];
  currentVestingSchedules?: NFTVestingSchedule[];
  availableCollections?: NFTCollection[];
  marketData?: NFTMarketData;
  requestType: 'NFT_STAKING_ANALYSIS' | 'NFT_VESTING_ANALYSIS' | 'NFT_POOL_CREATION' | 'NFT_PORTFOLIO_OPTIMIZATION';
}

export interface NFTAIRecommendationResponse {
  riskAnalysis: NFTRiskAnalysis;
  strategyRecommendations: NFTStrategyRecommendation[];
  poolCreationRecommendations?: NFTPoolCreationRecommendation[];
  marketInsights: string[];
  warnings: string[];
  nextSteps: string[];
  confidence: number; // 0-100
  collectionSpecificAdvice: {
    collection: string;
    advice: string;
    riskLevel: string;
  }[];
}

// Enhanced OpenAI API call with NFT-specific prompts
async function callNFTAI(prompt: string): Promise<string> {
  try {
    // Try to use real OpenAI API first
    const response = await openaiAPI.generateRecommendations(prompt);
    console.log('NFT AI API response received');
    return response;
  } catch (error) {
    console.warn('NFT AI API failed, using mock data:', error);
    // Fallback to mock data
    return generateNFTMockRecommendations(prompt);
  }
}

export async function getNFTAIRecommendations(
  request: NFTAIRecommendationRequest
): Promise<NFTAIRecommendationResponse> {
  try {
    // Build comprehensive prompt for NFT-specific analysis
    const prompt = buildNFTRecommendationPrompt(request);
    
    // Call OpenAI API with fallback
    const aiResponse = await callNFTAI(prompt);
    
    // Parse and structure the response
    const recommendations = parseNFTAIResponse(aiResponse, request);
    
    return recommendations;
  } catch (error) {
    console.error('Error getting NFT AI recommendations:', error);
    throw new Error('Failed to generate NFT AI recommendations');
  }
}

function buildNFTRecommendationPrompt(request: NFTAIRecommendationRequest): string {
  const { userProfile, currentStakingPositions, currentVestingSchedules, availableCollections, marketData, requestType } = request;
  
  let prompt = `You are a DeFi investment advisor specializing in NFT staking, vesting, and stake pool creation on blockchain networks. 
  
User Profile:
- Risk Tolerance: ${userProfile.riskTolerance}
- Investment Horizon: ${userProfile.investmentHorizon}
- Liquidity Needs: ${userProfile.liquidityNeeds}
- Experience Level: ${userProfile.experience}
- NFT Knowledge: ${userProfile.nftKnowledge}
- Portfolio Size: $${userProfile.portfolioSize.toLocaleString()}
- Goals: ${userProfile.goals.join(', ')}
- Preferred Collections: ${userProfile.preferredCollections.join(', ')}
- Max Impermanent Loss Tolerance: ${userProfile.maxImpermanentLoss}%
- Yield Target: ${userProfile.yieldTarget}%

Request Type: ${requestType}
`;

  if (currentStakingPositions && currentStakingPositions.length > 0) {
    prompt += `\nCurrent NFT Staking Positions:
${currentStakingPositions.map(pos => 
  `- ${pos.tokenId} (${pos.metadata?.collection || 'Unknown Collection'}) staked for ${Math.floor((Date.now() - pos.stakedAt) / (1000 * 60 * 60 * 24))} days, APR: ${pos.metadata?.attributes?.find(attr => attr.trait_type === 'APR')?.value || 'Unknown'}%, Locked: ${pos.isLocked}`
).join('\n')}`;
  }

  if (currentVestingSchedules && currentVestingSchedules.length > 0) {
    prompt += `\nCurrent NFT Vesting Schedules:
${currentVestingSchedules.map(schedule => 
  `- ${schedule.tokenId} (${schedule.metadata?.collection || 'Unknown Collection'}) ${schedule.claimedAmount}/${schedule.totalAmount} claimed, Cliff: ${schedule.isCliffReached ? 'Reached' : 'Pending'}`
).join('\n')}`;
  }

  if (availableCollections && availableCollections.length > 0) {
    prompt += `\nAvailable NFT Collections:
${availableCollections.map(col => 
  `- ${col.name}: Floor Price $${col.floorPrice}, Volume 24h $${col.volume24h}, Total Supply ${col.totalSupply}`
).join('\n')}`;
  }

  if (marketData) {
    prompt += `\nMarket Data:
- Total NFTs Staked: ${marketData.totalNFTsStaked}
- Average APR: ${marketData.averageAPR}%
- Market Sentiment: ${marketData.marketSentiment}
- Gas Fees: $${marketData.gasFees}
- Network Congestion: ${marketData.networkCongestion}
- Trending Collections: ${marketData.trendingCollections.join(', ')}`;
  }

  prompt += `\n\nPlease provide comprehensive analysis and recommendations for ${requestType.toLowerCase().replace(/_/g, ' ')}. 
Focus on NFT-specific considerations like:
- Collection rarity and utility
- Community strength and engagement
- Floor price stability and trends
- Smart contract security
- Liquidity and market depth
- Impermanent loss risks for staking pools
- Vesting schedule optimization
- Portfolio diversification across collections

Provide specific, actionable recommendations with risk assessments and expected returns.`;

  return prompt;
}

function parseNFTAIResponse(aiResponse: string, request: NFTAIRecommendationRequest): NFTAIRecommendationResponse {
  try {
    // Try to parse structured response
    const parsed = JSON.parse(aiResponse);
    return {
      riskAnalysis: parsed.riskAnalysis || generateDefaultNFTRiskAnalysis(),
      strategyRecommendations: parsed.strategyRecommendations || generateDefaultNFTStrategyRecommendations(request),
      poolCreationRecommendations: parsed.poolCreationRecommendations,
      marketInsights: parsed.marketInsights || [],
      warnings: parsed.warnings || [],
      nextSteps: parsed.nextSteps || [],
      confidence: parsed.confidence || 75,
      collectionSpecificAdvice: parsed.collectionSpecificAdvice || []
    };
  } catch (error) {
    console.warn('Failed to parse AI response, using default recommendations');
    return generateDefaultNFTRecommendations(request);
  }
}

function generateDefaultNFTRiskAnalysis(): NFTRiskAnalysis {
  return {
    riskLevel: 'MEDIUM',
    riskScore: 65,
    riskFactors: [
      'NFT market volatility',
      'Collection floor price fluctuations',
      'Smart contract security risks',
      'Liquidity constraints',
      'Community sentiment changes'
    ],
    recommendations: [
      'Diversify across multiple collections',
      'Monitor floor price trends regularly',
      'Verify smart contract audits',
      'Maintain emergency liquidity',
      'Stay informed about community developments'
    ],
    marketConditions: 'NFT market showing moderate volatility with mixed sentiment across collections',
    volatility: 70,
    liquidityRisk: 60,
    smartContractRisk: 45,
    communityRisk: 55,
    collectionSpecificRisks: [
      {
        collection: 'Bored Ape Yacht Club',
        risks: ['High floor price volatility', 'Community dependency'],
        riskLevel: 'MEDIUM'
      },
      {
        collection: 'CryptoPunks',
        risks: ['Market saturation', 'Competition from new collections'],
        riskLevel: 'LOW'
      }
    ]
  };
}

function generateDefaultNFTStrategyRecommendations(request: NFTAIRecommendationRequest): NFTStrategyRecommendation[] {
  const { userProfile } = request;
  
  return [
    {
      type: 'NFT_STAKING',
      strategy: 'Conservative NFT Staking Strategy',
      reasoning: [
        'Focus on established collections with strong communities',
        'Diversify across multiple collections to reduce risk',
        'Maintain adequate liquidity for emergencies',
        'Monitor APR trends and adjust positions accordingly'
      ],
      expectedReturns: {
        min: 8,
        max: 25,
        average: 15
      },
      timeHorizon: '6-12 months',
      riskTolerance: userProfile.riskTolerance,
      liquidityNeeds: userProfile.liquidityNeeds,
      nftAllocation: [
        {
          collection: 'Bored Ape Yacht Club',
          percentage: 40,
          reasoning: 'Strong community and utility'
        },
        {
          collection: 'CryptoPunks',
          percentage: 30,
          reasoning: 'Historical stability and recognition'
        },
        {
          collection: 'Doodles',
          percentage: 30,
          reasoning: 'Growing community and partnerships'
        }
      ],
      yieldOptimization: [
        'Stake during high APR periods',
        'Reinvest rewards for compound growth',
        'Monitor and adjust based on market conditions'
      ]
    }
  ];
}

function generateDefaultNFTRecommendations(request: NFTAIRecommendationRequest): NFTAIRecommendationResponse {
  return {
    riskAnalysis: generateDefaultNFTRiskAnalysis(),
    strategyRecommendations: generateDefaultNFTStrategyRecommendations(request),
    marketInsights: [
      'NFT staking pools are gaining popularity with average APRs of 15-25%',
      'Floor prices for top collections remain relatively stable',
      'New utility-focused collections are emerging',
      'Community engagement is a key factor in NFT value'
    ],
    warnings: [
      'NFT markets can be highly volatile',
      'Always verify smart contract security before staking',
      'Diversify across collections to manage risk',
      'Monitor floor price trends regularly'
    ],
    nextSteps: [
      'Research and select target NFT collections',
      'Verify smart contract audits and security',
      'Start with small positions to test strategies',
      'Set up monitoring and alert systems',
      'Join community discussions for insights'
    ],
    confidence: 75,
    collectionSpecificAdvice: [
      {
        collection: 'Bored Ape Yacht Club',
        advice: 'Strong community and utility make this a solid staking choice',
        riskLevel: 'MEDIUM'
      },
      {
        collection: 'CryptoPunks',
        advice: 'Historical stability but consider diversification',
        riskLevel: 'LOW'
      }
    ]
  };
}

export async function generateNFTMockRecommendations(prompt: string): Promise<string> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const mockResponse = {
    riskAnalysis: generateDefaultNFTRiskAnalysis(),
    strategyRecommendations: [
      {
        type: 'NFT_STAKING',
        strategy: 'Balanced NFT Staking Portfolio',
        reasoning: [
          'Diversification across established and emerging collections',
          'Focus on collections with strong utility and community',
          'Regular rebalancing based on market conditions'
        ],
        expectedReturns: {
          min: 10,
          max: 30,
          average: 18
        },
        timeHorizon: '12 months',
        riskTolerance: 'MODERATE',
        liquidityNeeds: 'MEDIUM',
        nftAllocation: [
          { collection: 'Bored Ape Yacht Club', percentage: 35, reasoning: 'Strong community and utility' },
          { collection: 'CryptoPunks', percentage: 25, reasoning: 'Historical stability' },
          { collection: 'Doodles', percentage: 25, reasoning: 'Growing ecosystem' },
          { collection: 'Azuki', percentage: 15, reasoning: 'Innovative approach' }
        ]
      }
    ],
    marketInsights: [
      'NFT staking is becoming mainstream with institutional adoption',
      'Floor prices showing resilience despite market volatility',
      'New collections focusing on utility over speculation',
      'Community-driven projects outperforming others'
    ],
    warnings: [
      'Always verify smart contract security',
      'Diversify across multiple collections',
      'Monitor floor price trends regularly',
      'Be prepared for market volatility'
    ],
    nextSteps: [
      'Research target collections thoroughly',
      'Start with small positions',
      'Set up monitoring systems',
      'Join community discussions'
    ],
    confidence: 80,
    collectionSpecificAdvice: [
      {
        collection: 'Bored Ape Yacht Club',
        advice: 'Excellent choice for staking with strong community support',
        riskLevel: 'MEDIUM'
      }
    ]
  };
  
  return JSON.stringify(mockResponse, null, 2);
}

export async function getNFTMarketData(): Promise<NFTMarketData> {
  // Mock market data - replace with real API calls
  return {
    totalNFTsStaked: 15000,
    averageAPR: 18.5,
    marketVolatility: 65,
    trendingCollections: ['Bored Ape Yacht Club', 'CryptoPunks', 'Doodles', 'Azuki'],
    marketSentiment: 'BULLISH',
    gasFees: 25,
    networkCongestion: 'MEDIUM',
    floorPriceTrends: [
      { collection: 'Bored Ape Yacht Club', trend: 'UP', percentageChange: 5.2 },
      { collection: 'CryptoPunks', trend: 'STABLE', percentageChange: 0.8 },
      { collection: 'Doodles', trend: 'UP', percentageChange: 12.5 }
    ]
  };
}

export function analyzeCurrentNFTPositions(
  stakingPositions: NFTStakingPosition[],
  vestingSchedules: NFTVestingSchedule[]
): any {
  const totalStaked = stakingPositions.length;
  const totalVesting = vestingSchedules.length;
  const averageStakingDuration = stakingPositions.length > 0 
    ? stakingPositions.reduce((sum, pos) => sum + (Date.now() - pos.stakedAt), 0) / stakingPositions.length / (1000 * 60 * 60 * 24)
    : 0;
  
  return {
    totalStaked,
    totalVesting,
    averageStakingDuration: Math.floor(averageStakingDuration),
    portfolioDiversity: stakingPositions.length + vestingSchedules.length,
    riskProfile: totalStaked > 5 ? 'HIGH' : totalStaked > 2 ? 'MEDIUM' : 'LOW'
  };
} 