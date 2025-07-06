// This is a stub file to replace the HotWallet module import
// Empty implementation to prevent build errors
export class HotWalletModule {
  constructor() {}
  // Add minimal required methods
  getAddress() { return Promise.resolve({ address: '' }); }
  signTransaction() { return Promise.resolve(''); }
  isConnected() { return false; }
  connect() { return Promise.resolve(false); }
  disconnect() { return Promise.resolve(); }
} 