// OpenAI API integration for AI recommendations
// Note: You'll need to add your OpenAI API key to your environment variables

export interface OpenAIRequest {
  model: string;
  messages: Array<{
    role: 'system' | 'user' | 'assistant';
    content: string;
  }>;
  temperature?: number;
  max_tokens?: number;
}

export interface OpenAIResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: Array<{
    index: number;
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }>;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export class OpenAIAPI {
  private apiKey: string;
  private baseURL: string;

  constructor() {
    this.apiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY || '';
    this.baseURL = 'https://api.openai.com/v1';
  }

  private async makeRequest(endpoint: string, data: any): Promise<OpenAIResponse> {
    if (!this.apiKey) {
      throw new Error('OpenAI API key not found. Please set NEXT_PUBLIC_OPENAI_API_KEY in your environment variables.');
    }

    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`OpenAI API error: ${response.status} - ${errorData.error?.message || response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('OpenAI API request failed:', error);
      throw error;
    }
  }

  async generateRecommendations(prompt: string): Promise<string> {
    const request: OpenAIRequest = {
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: `You are a DeFi investment advisor specializing in NFT staking, vesting, and pool creation on the Stellar blockchain. 
          You provide detailed, actionable advice based on user profiles, market conditions, and current positions.
          Always respond with valid JSON that matches the expected structure for AI recommendations.
          Be conservative in your risk assessments and always include appropriate warnings and disclaimers.`
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.3, // Lower temperature for more consistent, conservative responses
      max_tokens: 2000
    };

    try {
      const response = await this.makeRequest('/chat/completions', request);
      return response.choices[0]?.message?.content || '';
    } catch (error) {
      console.error('Failed to generate AI recommendations:', error);
      throw new Error('Failed to generate AI recommendations. Please try again later.');
    }
  }

  async analyzeMarketConditions(marketData: any): Promise<string> {
    const prompt = `Analyze the following DeFi market data and provide insights:
    
    Market Data:
    - Total Value Locked: $${marketData.totalValueLocked?.toLocaleString() || 'N/A'}
    - Average APR: ${marketData.averageAPR?.toFixed(1) || 'N/A'}%
    - Market Volatility: ${marketData.marketVolatility || 'N/A'}%
    - Trending Collections: ${marketData.trendingCollections?.join(', ') || 'N/A'}
    
    Please provide:
    1. Current market sentiment
    2. Key trends to watch
    3. Potential risks and opportunities
    4. Recommendations for different risk profiles
    
    Format as JSON with keys: sentiment, trends, risks, opportunities, recommendations`;

    return this.generateRecommendations(prompt);
  }

  async generateRiskAssessment(userProfile: any, positions: any[]): Promise<string> {
    const prompt = `Generate a comprehensive risk assessment for a DeFi user:
    
    User Profile:
    - Risk Tolerance: ${userProfile.riskTolerance}
    - Investment Horizon: ${userProfile.investmentHorizon}
    - Experience Level: ${userProfile.experience}
    - Portfolio Size: $${userProfile.portfolioSize?.toLocaleString()}
    
    Current Positions: ${positions.length} positions
    
    Please provide a detailed risk analysis including:
    1. Overall risk level (LOW/MEDIUM/HIGH/EXTREME)
    2. Risk score (0-100)
    3. Key risk factors
    4. Risk mitigation strategies
    5. Portfolio diversification recommendations
    
    Format as JSON with the structure expected by the risk analysis component.`;

    return this.generateRecommendations(prompt);
  }

  async generateStrategyRecommendations(userProfile: any, marketData: any, requestType: string): Promise<string> {
    const prompt = `Generate investment strategy recommendations for a DeFi user:
    
    Request Type: ${requestType}
    User Profile: ${JSON.stringify(userProfile, null, 2)}
    Market Data: ${JSON.stringify(marketData, null, 2)}
    
    Please provide:
    1. Specific strategy recommendations
    2. Expected returns (min, max, average)
    3. Time horizons
    4. Diversification suggestions
    5. Implementation steps
    
    Format as JSON with the structure expected by the strategy recommendations component.`;

    return this.generateRecommendations(prompt);
  }
}

// Export a singleton instance
export const openaiAPI = new OpenAIAPI();

// Fallback function for when OpenAI API is not available
export async function generateMockRecommendations(prompt: string): Promise<string> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Return mock data based on prompt content
  if (prompt.includes('risk analysis')) {
    return JSON.stringify({
      riskLevel: 'MEDIUM',
      riskScore: 65,
      riskFactors: [
        'Market volatility in NFT sector',
        'Liquidity constraints during lock periods',
        'Smart contract risks',
        'Regulatory uncertainty'
      ],
      recommendations: [
        'Diversify across multiple collections',
        'Consider shorter lock periods initially',
        'Monitor market conditions regularly',
        'Set stop-loss limits'
      ],
      marketConditions: 'Current market shows moderate volatility with strong growth potential in NFT staking sector.',
      volatility: 45
    });
  }
  
  if (prompt.includes('strategy recommendation')) {
    return JSON.stringify({
      type: 'STAKING',
      strategy: 'Gradual entry with diversification',
      reasoning: [
        'Reduces exposure to single collection risk',
        'Allows for market timing optimization',
        'Provides liquidity management flexibility'
      ],
      expectedReturns: {
        min: 8.5,
        max: 22.3,
        average: 15.4
      },
      timeHorizon: '6-12 months',
      riskTolerance: 'MODERATE',
      liquidityNeeds: 'MEDIUM',
      diversification: [
        'Blend Punks (40%)',
        'Stellar Apes (30%)',
        'Space Cats (30%)'
      ]
    });
  }
  
  return JSON.stringify({
    message: 'Mock AI recommendation generated successfully',
    timestamp: new Date().toISOString()
  });
} 