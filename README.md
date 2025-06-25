# Stellar Staking & Vesting DApp with Blend Protocol

A comprehensive decentralized staking and vesting application built on the **Stellar blockchain**, leveraging the **Blend Protocol** for enhanced DeFi capabilities. This modern React-based dApp provides users with seamless staking, vesting, and liquidity management features while maintaining transparency and security through blockchain technology.

## 🌟 Overview

This application utilizes Stellar's robust ecosystem and the Blend Protocol's advanced lending and borrowing capabilities. The platform enables users to stake XLM and other Stellar assets, participate in vesting programs, and interact with decentralized finance protocols.

## 🚀 Live Demo

- **Production**: [Coming Soon]
- **Testnet Demo**: [Coming Soon]

## 📋 Table of Contents

- [Features](#-features)
- [Technology Stack](#-technology-stack)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Development](#-development)
- [Stellar Integration](#-stellar-integration)
- [Blend Protocol Integration](#-blend-protocol-integration)
- [Project Structure](#-project-structure)
- [Smart Contracts](#-smart-contracts)
- [Testing](#-testing)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [License](#-license)

## ✨ Features

### Core Functionality
- **🏦 Asset Staking**: Stake XLM and other Stellar assets with competitive APY rates
- **⏰ Token Vesting**: Create and manage vesting schedules for token distributions
- **🎨 NFT Staking**: Stake NFTs for additional rewards and utility
- **📊 Real-time Dashboard**: Monitor staking performance, rewards, and portfolio analytics
- **💰 Reward Claims**: Seamless claiming of staking and vesting rewards

### Blend Protocol Integration
- **🔄 Liquidity Provision**: Provide liquidity to Blend pools for enhanced yields
- **💸 Lending & Borrowing**: Leverage staked assets as collateral for borrowing
- **📈 Yield Optimization**: Automated strategies for maximizing returns
- **🛡️ Risk Management**: Built-in risk assessment and management tools

### User Experience
- **🔗 Wallet Integration**: Support for multiple Stellar wallets (Freighter, LOBSTR, xBull)
- **🌙 Dark/Light Mode**: Responsive design with theme switching
- **📱 Mobile Responsive**: Optimized for all device sizes
- **🔔 Real-time Notifications**: Transaction status and reward notifications

## 🛠️ Technology Stack

### Frontend
- **React 18.3.1** - Modern React with hooks and concurrent features
- **Vite 5.0.8** - Fast build tool and development server
- **Tailwind CSS 3.4.1** - Utility-first CSS framework
- **React Router Dom 7.1.4** - Client-side routing
- **Recharts 2.12.2** - Data visualization and charts

### Stellar Ecosystem
- **Stellar Wallets Kit 1.7.5** - Multi-wallet integration
- **Stellar SDK** - Blockchain interactions
- **Soroban** - Smart contract platform
- **Blend Protocol** - DeFi lending and borrowing

### Development Tools
- **ESLint** - Code linting and formatting
- **PostCSS & Autoprefixer** - CSS processing
- **Buffer Polyfills** - Browser compatibility
- **Hot Module Replacement** - Fast development experience

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18.0.0 or higher)
- **npm** or **yarn** package manager
- **Git** for version control
- **Stellar-compatible wallet** (Freighter, LOBSTR, or xBull)

### Stellar Network Setup
- Access to Stellar Testnet/Mainnet
- Testnet XLM for development (get from [Stellar Laboratory](https://laboratory.stellar.org/#account-creator))
- Basic understanding of Stellar concepts (accounts, assets, operations)

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/stellar-staking-frontend.git
   cd stellar-staking-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Install Stellar CLI (optional for advanced development)**
   ```bash
   npm install -g @stellar/cli
   ```

## ⚙️ Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
# Stellar Network Configuration
VITE_STELLAR_NETWORK=testnet  # or 'mainnet'
VITE_STELLAR_HORIZON_URL=https://horizon-testnet.stellar.org
VITE_STELLAR_PASSPHRASE=Test SDF Network ; September 2015

# Blend Protocol Configuration
VITE_BLEND_POOL_ADDRESS=your_blend_pool_address
VITE_BLEND_API_URL=https://api.blend.capital

# Contract Addresses (Soroban)
VITE_STAKING_CONTRACT_ID=your_staking_contract_id
VITE_VESTING_CONTRACT_ID=your_vesting_contract_id
VITE_NFT_STAKING_CONTRACT_ID=your_nft_staking_contract_id

# Application Configuration
VITE_APP_NAME=Stellar Staking DApp
VITE_DEFAULT_WALLET=freighter
```

### Wallet Configuration

The application supports multiple Stellar wallets:

```javascript
// Supported wallets in WalletContextProvider.tsx
const supportedWallets = [
  'freighter',    // Freighter browser extension
  'lobstr',       // LOBSTR mobile wallet
  'xbull',        // xBull wallet
  'albedo',       // Albedo web wallet
];
```

## 🚀 Development

### Start Development Server

```bash
npm run dev
# or
yarn dev
```

The application will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
# or
yarn build
```

### Preview Production Build

```bash
npm run preview
# or
yarn preview
```

### Linting

```bash
npm run lint
# or
yarn lint
```

## 🌟 Stellar Integration

### Wallet Connection

The application uses the Stellar Wallets Kit for seamless wallet integration:

```javascript
import { StellarWalletsKit, WalletNetwork } from '@creit.tech/stellar-wallets-kit';

// Initialize wallet kit
const kit = new StellarWalletsKit({
  network: WalletNetwork.TESTNET, // or MAINNET
  selectedWalletId: FREIGHTER_ID,
  modules: allowAllModules(),
});
```

### Asset Management

Support for various Stellar assets:
- **Native XLM** - Primary staking asset
- **Custom Tokens** - Project-specific tokens
- **NFTs** - Collectible assets for staking

### Transaction Handling

All transactions are processed through Stellar's robust transaction system:
- **Multi-signature support**
- **Atomic operations**
- **Low transaction fees**
- **Fast confirmation times**

## 🔗 Blend Protocol Integration

### Lending Pools

Integration with Blend's lending pools for:
- **Liquidity provision**
- **Yield farming**
- **Collateral management**

### Borrowing Capabilities

- Use staked assets as collateral
- Access to multiple asset types
- Dynamic interest rates
- Liquidation protection

### Yield Optimization

- Automated rebalancing
- Compound interest strategies
- Risk-adjusted returns

## 📁 Project Structure

```
stellar-staking-frontend/
├── public/                     # Static assets
│   ├── icons/                 # SVG icons and graphics
│   └── images/                # Images and NFT assets
├── src/
│   ├── components/            # Reusable React components
│   │   ├── Dashboard/         # Dashboard-specific components
│   │   ├── Staking/          # Staking interface components
│   │   ├── Vesting/          # Vesting management components
│   │   └── StakingPool/      # Pool management components
│   ├── pages/                # Page components
│   │   ├── Dashboard/        # Main dashboard page
│   │   ├── staking/          # Staking interface
│   │   ├── vesting/          # Vesting management
│   │   └── setting/          # User settings
│   ├── contracts/            # Smart contract interfaces
│   │   ├── staking.ts        # Staking contract logic
│   │   ├── vesting.ts        # Vesting contract logic
│   │   └── utils.js          # Contract utilities
│   ├── icons/                # React icon components
│   └── main.jsx              # Application entry point
├── vite.config.js            # Vite configuration
├── tailwind.config.js        # Tailwind CSS configuration
└── package.json              # Dependencies and scripts
```

## 📜 Smart Contracts

### Soroban Contracts

The application interacts with several Soroban smart contracts:

1. **Staking Contract** (`staking.ts`)
   - Handles XLM and token staking
   - Manages reward distribution
   - Implements slashing mechanisms

2. **Vesting Contract** (`vesting.ts`)
   - Creates vesting schedules
   - Manages token releases
   - Handles cliff periods

3. **NFT Staking Contract** (`nftstaking.ts`)
   - NFT staking mechanics
   - Rarity-based rewards
   - Collection management

### Contract Deployment

```bash
# Deploy to Stellar testnet
stellar contract deploy --wasm contract.wasm --network testnet

# Initialize contract
stellar contract invoke --id CONTRACT_ID --network testnet -- initialize
```

## 🧪 Testing

### Unit Tests

```bash
npm run test
# or
yarn test
```

### Integration Tests

```bash
npm run test:integration
# or
yarn test:integration
```

### E2E Tests

```bash
npm run test:e2e
# or
yarn test:e2e
```

## 🚢 Deployment

### Vercel Deployment

1. **Connect your repository to Vercel**
2. **Configure environment variables**
3. **Deploy with automatic builds**

```bash
# Manual deployment
npm run build
vercel --prod
```

### Docker Deployment

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "preview"]
```

### IPFS Deployment

For decentralized hosting:

```bash
# Build the application
npm run build

# Deploy to IPFS
ipfs add -r dist/
```

## 🤝 Contributing

We welcome contributions to improve the Stellar Staking DApp! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Commit your changes** (`git commit -m 'Add amazing feature'`)
4. **Push to the branch** (`git push origin feature/amazing-feature`)
5. **Open a Pull Request**

### Development Guidelines

- Follow React best practices
- Use TypeScript for new components
- Maintain responsive design principles
- Write comprehensive tests
- Document new features

### Code Style

- Use ESLint configuration
- Follow Prettier formatting
- Use meaningful variable names
- Add JSDoc comments for functions

## 🛡️ Security

- **Smart Contract Audits**: All contracts undergo security audits
- **Wallet Security**: Non-custodial wallet integration
- **HTTPS Only**: Secure communication protocols
- **Regular Updates**: Keep dependencies updated

## 📚 Resources

### Stellar Documentation
- [Stellar Developer Portal](https://developers.stellar.org/)
- [Soroban Documentation](https://soroban.stellar.org/)
- [Stellar Laboratory](https://laboratory.stellar.org/)

### Blend Protocol
- [Blend Protocol Documentation](https://docs.blend.capital/)
- [Blend API Reference](https://api.blend.capital/docs)

### Community
- [Stellar Discord](https://discord.gg/stellar)
- [Stellar Stack Exchange](https://stellar.stackexchange.com/)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Stellar Development Foundation** for the robust blockchain platform
- **Blend Protocol** for DeFi infrastructure
- **Stellar Wallets Kit** for wallet integration
- **React Community** for the excellent frontend framework

---

**Built with ❤️ on Stellar Blockchain**

For support, please reach out through [GitHub Issues](https://github.com/yourusername/stellar-staking-frontend/issues) or join our community channels.



