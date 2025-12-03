/**
 * CIP-30 Simulator
 * Mock CIP-30 wallet interface for testing
 * In production, this would connect to real CIP-30 wallets via dApp connector
 */

const logger = require('../app-logger');
const { v4: uuidv4 } = require('uuid');

class CIP30Simulator {
  constructor() {
    this.mockWallets = new Map();
    this.initializeMockWallets();
  }

  /**
   * Initialize mock wallets for testing
   */
  initializeMockWallets() {
    this.mockWallets.set('test-wallet-1', {
      name: 'Test Wallet 1',
      address: 'addr_test1vp8kjx2mzqjf0zf7jfzzqy5f8dxd0mf2p3dngzj5y7q3zf8r6',
      publicKey: 'a0a1a2a3a4a5a6a7a8a9b0b1b2b3b4b5b6b7b8b9c0c1c2c3c4c5c6c7c8c9',
      balance: 5000000000 // 5000 ADA in lovelace
    });

    logger.info('Mock CIP-30 wallets initialized');
  }

  /**
   * Get available wallets
   */
  getAvailableWallets() {
    return Array.from(this.mockWallets.keys());
  }

  /**
   * Get wallet details
   */
  getWalletDetails(walletId) {
    if (!this.mockWallets.has(walletId)) {
      throw new Error(`Wallet not found: ${walletId}`);
    }
    return this.mockWallets.get(walletId);
  }

  /**
   * Sign message with wallet
   */
  async signMessage(walletId, message) {
    try {
      const wallet = this.getWalletDetails(walletId);

      // Simulate signing delay
      await new Promise(resolve => setTimeout(resolve, 100));

      const signature = {
        signature_id: uuidv4(),
        wallet_id: walletId,
        address: wallet.address,
        message: message,
        signature: Buffer.from(message).toString('hex').padEnd(128, '0'),
        timestamp: Math.floor(Date.now() / 1000)
      };

      logger.info(`Message signed with wallet: ${walletId}`);
      return signature;
    } catch (err) {
      logger.error(`Message signing error: ${err.message}`);
      throw err;
    }
  }

  /**
   * Send transaction (simulated)
   */
  async sendTransaction(walletId, transaction) {
    try {
      const wallet = this.getWalletDetails(walletId);

      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 200));

      const txHash = uuidv4().replace(/-/g, '');

      logger.info(`Transaction sent from ${walletId}: ${txHash}`);

      return {
        txHash: txHash,
        status: 'submitted',
        timestamp: Math.floor(Date.now() / 1000)
      };
    } catch (err) {
      logger.error(`Transaction sending error: ${err.message}`);
      throw err;
    }
  }
}

module.exports = new CIP30Simulator();
