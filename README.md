# DeeDAO - Decentralized Finance Platform

![DeeDAO Logo](public/deedao.svg)

A comprehensive decentralized finance (DeFi) platform built on the Stellar network, featuring advanced trading, staking, vesting, and AI-powered investment recommendations.

## 🌟 Features

### 🏦 Core DeFi Features
- **Lending & Borrowing**: Supply assets as collateral and borrow against them
- **Staking**: Earn rewards by staking your tokens in various pools
- **Vesting**: Manage token vesting schedules with customizable parameters
- **Position Maker**: Create and manage trading positions with real-time P&L tracking
- **Backstop Protection**: Advanced risk management with backstop mechanisms
- **Auction System**: Participate in asset auctions and liquidations

### 🤖 AI-Powered Features
- **AI Investment Recommendations**: Get personalized investment strategies based on market analysis
- **Risk Analysis**: AI-driven risk assessment for your portfolio
- **Market Insights**: Real-time market analysis and trend predictions
- **Token Strategy Recommendations**: Optimized token allocation strategies
- **NFT AI Advisor**: Specialized recommendations for NFT investments

### 🎨 NFT Ecosystem
- **NFT Staking**: Stake your NFTs to earn rewards
- **NFT Vesting**: Manage NFT vesting schedules
- **NFT Distribution**: Distribute NFTs to multiple addresses
- **NFT AI Recommendations**: AI-powered NFT investment strategies

### 🔧 Advanced Features
- **Multi-Wallet Support**: Connect with Freighter, Albedo, and other Stellar wallets
- **Real-time Oracle Integration**: Live price feeds and market data
- **Portfolio Management**: Track all your positions and assets in one place
- **Transaction Simulation**: Preview transactions before execution
- **Custom Pool Creation**: Create and manage your own liquidity pools

## 🚀 Quick Start

### Prerequisites
- Node.js 18.0.0 or higher
- npm 9.5.0 or higher
- A Stellar wallet (Freighter, Albedo, etc.)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd deeDAOnew
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   # Copy the example environment file
   cp .env.example .env.local
   
   # Edit .env.local with your configuration
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Build Commands

```bash
# Development build
npm run build

# Testnet build
npm run build:testnet

# Mainnet build
npm run build:mainnet

# Start production server
npm start

# Lint code
npm run lint
```

## 🏗️ Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── ai-recommendations/    # AI recommendation components
│   ├── auction/              # Auction-related components
│   ├── backstop/             # Backstop protection components
│   ├── borrow/               # Borrowing interface components
│   ├── common/               # Shared UI components
│   ├── dashboard/            # Dashboard components
│   ├── lend/                 # Lending interface components
│   ├── markets/              # Market display components
│   ├── nav/                  # Navigation components
│   ├── nft-ai-recommendations/ # NFT AI components
│   ├── nft-staking/          # NFT staking components
│   ├── nft-vesting/          # NFT vesting components
│   ├── pool/                 # Pool management components
│   ├── position-maker/       # Position maker components
│   ├── staking/              # Staking components
│   ├── token-ai-recommendations/ # Token AI components
│   ├── vesting/              # Vesting components
│   └── withdraw/             # Withdrawal components
├── contexts/             # React contexts for state management
├── hooks/                # Custom React hooks
├── layouts/              # Page layout components
├── pages/                # Next.js pages
├── utils/                # Utility functions
└── theme.ts              # Material-UI theme configuration
```

## 🎯 Key Pages

### Core DeFi
- **Dashboard** (`/dashboard`) - Overview of your portfolio and positions
- **Markets** (`/`) - Browse available lending and borrowing markets
- **Borrow** (`/borrow`) - Borrow assets against your collateral
- **Lend** (`/lend`) - Supply assets to earn interest
- **Stake** (`/stake`) - Stake tokens to earn rewards
- **Vesting** (`/vesting`) - Manage token vesting schedules

### Advanced Features
- **Position Maker** (`/position-maker`) - Create and manage trading positions
- **Backstop** (`/backstop`) - Advanced risk management
- **Auction** (`/auction`) - Participate in asset auctions
- **Asset Management** (`/asset`) - Detailed asset information and management

### AI Features
- **AI Recommendations** (`/ai-recommendations`) - General AI investment advice
- **Token AI** (`/token-ai-recommendations`) - Token-specific recommendations
- **NFT AI** (`/nft-ai-recommendations`) - NFT investment strategies

### NFT Ecosystem
- **NFT Staking** (`/nft-staking`) - Stake NFTs for rewards
- **NFT Vesting** (`/nft-vesting`) - NFT vesting management
- **Distribute NFTs** (`/distribute-nfts`) - Distribute NFTs to multiple addresses
- **Distribute Tokens** (`/distribute-tokens`) - Distribute tokens to multiple addresses

## 🛠️ Technology Stack

### Frontend
- **Next.js 14** - React framework with SSR/SSG
- **React 18** - UI library
- **TypeScript** - Type-safe JavaScript
- **Material-UI (MUI)** - Component library
- **Emotion** - CSS-in-JS styling

### Blockchain
- **Stellar SDK** - Stellar blockchain integration
- **Blend Capital SDK** - DeFi protocol integration
- **Stellar Wallets Kit** - Multi-wallet support

### State Management
- **React Query (TanStack Query)** - Server state management
- **React Context** - Client state management

### AI Integration
- **OpenAI API** - AI-powered recommendations
- **Custom AI Services** - Specialized DeFi analysis

## 🎨 Design System

The project uses a comprehensive design system with:
- **Green Branding**: Modern green color scheme for a fresh, trustworthy appearance
- **Material Design**: Consistent UI patterns and components
- **Responsive Design**: Mobile-first approach with adaptive layouts
- **Dark Theme**: Optimized for DeFi trading environments

### Color Palette
- **Primary Green**: `#4CAF50` - Main brand color
- **Secondary Green**: `#66BB6A` - Secondary elements
- **Dark Green**: `#388E3C` - Important actions
- **Light Green**: `#81C784` - Lend operations
- **Very Light Green**: `#A5D6A7` - Positive indicators

## 🔐 Security Features

- **Wallet Integration**: Secure connection with multiple Stellar wallets
- **Transaction Simulation**: Preview all transactions before execution
- **Risk Management**: Built-in backstop protection mechanisms
- **Oracle Integration**: Reliable price feeds for accurate valuations
- **Audit Trail**: Complete transaction history and logging

## 🌐 Network Support

- **Testnet**: Development and testing environment
- **Mainnet**: Production environment
- **Multi-Network**: Support for different Stellar network configurations

## 📱 Mobile Support

- **Responsive Design**: Optimized for all screen sizes
- **Touch-Friendly**: Mobile-optimized interactions
- **Progressive Web App**: Installable on mobile devices

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Use Material-UI components consistently
- Write comprehensive tests for new features
- Update documentation for API changes

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: Check the inline code comments and component documentation
- **Issues**: Report bugs and feature requests via GitHub Issues
- **Discussions**: Join community discussions for questions and ideas

## 🔗 Links

- **Live Demo**: [DeeDAO Platform](https://your-domain.com)
- **Documentation**: [API Documentation](https://docs.your-domain.com)
- **Community**: [Discord](https://discord.gg/deedao)
- **Twitter**: [@DeeDAO_Official](https://twitter.com/DeeDAO_Official)

---

**Built with ❤️ by the DeeDAO Team**

*Empowering decentralized finance through innovation and AI-driven insights.* 