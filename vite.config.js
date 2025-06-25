import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill'
import nodePolyfills from 'rollup-plugin-polyfill-node'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    base: './',
    define: {
      global: 'globalThis',
      'process.env.NODE_ENV': JSON.stringify(mode),
    },
    build: {
      rollupOptions: {
        plugins: [nodePolyfills()],
        external: [
          // Exclude Solana dependencies from bundling
          '@solana/web3.js',
          '@solana/spl-token',
          '@project-serum/anchor',
          '@nfteyez/sol-rayz',
          '@reown/appkit',
          '@reown/appkit-adapter-solana'
        ]
      },
    },
    optimizeDeps: {
      include: [
        'buffer',
        'process',
        'react',
        'react-dom',
        'react-toastify',
        '@creit.tech/stellar-wallets-kit'
      ],
      exclude: [
        // Exclude Solana dependencies from optimization
        '@solana/web3.js',
        '@solana/spl-token',
        '@project-serum/anchor',
        '@nfteyez/sol-rayz',
        '@reown/appkit',
        '@reown/appkit-adapter-solana'
      ],
      force: true,
      esbuildOptions: {
        define: {
          global: 'globalThis',
        },
        plugins: [
          NodeGlobalsPolyfillPlugin({
            buffer: true,
            process: true,
          }),
        ],
      },
    },
    resolve: {
      alias: {
        crypto: 'crypto-browserify',
        stream: 'stream-browserify',
        buffer: 'buffer',
        process: 'process/browser',
        util: 'util',
      },
    },
    plugins: [
      react(),
    ],
    server: {
      host: true,
      force: true,
      fs: {
        // Allow serving files from contracts directory but don't process them
        allow: ['..'],
        deny: [
          // Prevent Vite from processing contract files
          '**/src/contracts/**/*.js',
          '**/src/contracts/**/*.ts'
        ]
      }
    },
  }
})