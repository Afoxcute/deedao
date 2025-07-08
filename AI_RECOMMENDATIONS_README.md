# AI Investment Advisor - NFT Staking & DeFi Recommendations

This feature provides AI-powered investment recommendations for NFT staking, vesting, and pool creation on the Stellar blockchain using OpenAI's GPT-4 model.

## Features

### 🤖 AI-Powered Analysis
- **Risk Assessment**: Comprehensive risk analysis with scoring and mitigation strategies
- **Strategy Recommendations**: Personalized investment strategies based on user profile
- **Market Insights**: Real-time market analysis and trend identification
- **Portfolio Optimization**: Suggestions for portfolio diversification and rebalancing

### 📊 User Profile System
- Risk tolerance assessment (Conservative, Moderate, Aggressive)
- Investment horizon planning (Short, Medium, Long term)
- Liquidity needs evaluation
- Experience level consideration
- Portfolio size and goals analysis

### 🎯 Recommendation Types
1. **NFT Staking Analysis**: Best staking strategies for NFT collections
2. **NFT Vesting Analysis**: Optimal vesting schedules and token distribution
3. **Pool Creation Strategy**: Guidance for creating new staking pools
4. **Portfolio Optimization**: Overall portfolio improvement recommendations

## Setup Instructions

### 1. Environment Variables

Add your OpenAI API key to your environment variables:

```bash
# .env.local
NEXT_PUBLIC_OPENAI_API_KEY=your_openai_api_key_here
```

### 2. OpenAI API Key

1. Go to [OpenAI Platform](https://platform.openai.com/)
2. Create an account or sign in
3. Navigate to API Keys section
4. Create a new API key
5. Copy the key and add it to your environment variables

### 3. API Usage Considerations

- The system uses GPT-4 model for high-quality recommendations
- Temperature is set to 0.3 for consistent, conservative responses
- Maximum tokens: 2000 per request
- Fallback to mock data if API is unavailable

## Usage

### Accessing the AI Advisor

1. **Navigation**: Click on "🤖 AI Advisor" in the sidebar or navigation menu
2. **Wallet Connection**: Ensure your wallet is connected
3. **Profile Setup**: Complete your investment profile questionnaire
4. **Generate Recommendations**: Click "Generate AI Recommendations"

### Profile Configuration

The AI advisor collects the following information:

- **Risk Tolerance**: Conservative, Moderate, or Aggressive
- **Investment Horizon**: Short-term (1-6 months), Medium-term (6-24 months), or Long-term (2+ years)
- **Liquidity Needs**: High, Medium, or Low
- **Experience Level**: Beginner, Intermediate, or Expert
- **Portfolio Size**: Total value in USD
- **Investment Goals**: Multiple selection from predefined options

### Understanding Recommendations

#### Risk Analysis
- **Risk Level**: Color-coded risk assessment (Low, Medium, High, Extreme)
- **Risk Score**: Numerical score from 0-100
- **Risk Factors**: Key factors contributing to risk assessment
- **Recommendations**: Specific strategies to mitigate risks

#### Strategy Recommendations
- **Strategy Type**: Staking, Vesting, or Pool Creation
- **Expected Returns**: Minimum, average, and maximum return projections
- **Time Horizon**: Recommended investment duration
- **Diversification**: Suggested portfolio allocation

#### Market Insights
- **Current Trends**: Market sentiment and trending collections
- **Warnings**: Important risk factors and considerations
- **Next Steps**: Actionable recommendations for implementation

## Technical Implementation

### File Structure

```
src/
├── components/
│   └── ai-recommendations/
│       ├── AIRecommendationPanel.tsx      # Main recommendation interface
│       ├── UserProfileForm.tsx            # User profile questionnaire
│       ├── RiskAnalysisCard.tsx           # Risk assessment display
│       ├── StrategyRecommendationsCard.tsx # Strategy recommendations
│       └── MarketInsightsCard.tsx         # Market insights and warnings
├── utils/
│   ├── ai-recommendations.ts              # Core AI recommendation logic
│   └── openai-api.ts                     # OpenAI API integration
└── pages/
    └── ai-recommendations.tsx             # AI recommendations page
```

### Key Components

#### AIRecommendationPanel
- Main orchestrator component
- Handles user profile collection
- Manages API calls and state
- Displays all recommendation sections

#### UserProfileForm
- Collects user investment preferences
- Validates form data
- Provides helpful descriptions for each option

#### RiskAnalysisCard
- Displays risk assessment with visual indicators
- Shows risk factors and mitigation strategies
- Uses color-coded risk levels

#### StrategyRecommendationsCard
- Expandable strategy recommendations
- Expected returns visualization
- Diversification suggestions

#### MarketInsightsCard
- Market trends and insights
- Important warnings and disclaimers
- Actionable next steps

### API Integration

The system uses a robust API integration with fallback:

```typescript
// Primary: Real OpenAI API
const response = await openaiAPI.generateRecommendations(prompt);

// Fallback: Mock data if API fails
const mockResponse = await generateMockRecommendations(prompt);
```

### Data Flow

1. **User Input**: Profile form submission
2. **Data Collection**: Current positions, available collections, market data
3. **Prompt Generation**: Structured prompt for OpenAI
4. **API Call**: OpenAI GPT-4 analysis
5. **Response Parsing**: JSON parsing and validation
6. **UI Rendering**: Display recommendations in cards

## Customization

### Adding New Recommendation Types

1. Update the `AIRecommendationRequest` interface
2. Add new request type to the prompt builder
3. Create specialized components if needed
4. Update the main page tabs

### Modifying Risk Assessment

1. Update the `RiskAnalysis` interface
2. Modify the prompt template
3. Adjust the risk calculation logic
4. Update the UI components

### Customizing Market Data

1. Implement real market data APIs
2. Update the `getMarketData()` function
3. Add new data sources as needed
4. Modify the analysis prompts

## Security & Privacy

### Data Handling
- User profiles are stored locally (not persisted)
- No sensitive data is sent to OpenAI
- API calls are made client-side with proper error handling

### API Security
- API keys are stored in environment variables
- Requests include proper authentication headers
- Error handling prevents API key exposure

### Recommendations
- All recommendations include appropriate disclaimers
- Risk warnings are prominently displayed
- Users are advised to do their own research

## Troubleshooting

### Common Issues

1. **API Key Not Found**
   - Ensure `NEXT_PUBLIC_OPENAI_API_KEY` is set in environment variables
   - Restart the development server after adding the key

2. **API Rate Limits**
   - The system will fallback to mock data if rate limited
   - Check OpenAI usage dashboard for quota information

3. **JSON Parsing Errors**
   - The system includes robust error handling
   - Fallback recommendations will be provided

4. **Component Loading Issues**
   - Ensure all dependencies are installed
   - Check for TypeScript compilation errors

### Debug Mode

Enable debug logging by adding to your environment:

```bash
NEXT_PUBLIC_DEBUG_AI=true
```

This will log API calls and responses to the console.

## Future Enhancements

### Planned Features
- **Historical Analysis**: Track recommendation accuracy over time
- **Portfolio Tracking**: Monitor actual vs. recommended performance
- **Advanced Analytics**: More sophisticated market analysis
- **Multi-Chain Support**: Extend to other blockchains
- **Real-time Updates**: Live market data integration

### Potential Integrations
- **CoinGecko API**: Real-time crypto market data
- **DeFi Pulse**: DeFi protocol analytics
- **NFT Marketplaces**: Collection-specific data
- **Social Sentiment**: Twitter/Reddit sentiment analysis

## Support

For issues or questions:
1. Check the troubleshooting section
2. Review the console for error messages
3. Verify API key configuration
4. Test with mock data first

## Disclaimer

This AI advisor provides educational and informational content only. It should not be considered as financial advice. Always conduct your own research and consider consulting with a financial advisor before making investment decisions. Past performance does not guarantee future results. 