/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
  output: 'export',
  transpilePackages: [
    'depd',
    '@hot-wallet/sdk',
    '@creit.tech/stellar-wallets-kit',
    '@near-js/utils'
  ],
  webpack: (config) => {
    // Add fallbacks for node modules
    config.resolve.fallback = { 
      ...config.resolve.fallback,
      "sha1": false,
    };
    
    // Add resolver for problematic modules
    config.resolve.alias = {
      ...config.resolve.alias,
      // Use a mock implementation for problematic modules
      '@creit.tech/stellar-wallets-kit/modules/hotwallet.module.mjs': './src/patches/hotwallet-stub.js',
      '@hot-wallet/sdk': false,
    };
    
    return config;
  },
};

export default nextConfig;
