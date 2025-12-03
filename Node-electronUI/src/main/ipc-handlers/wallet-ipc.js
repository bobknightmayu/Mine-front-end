/**
 * Wallet IPC Handlers
 * Handle all wallet-related operations
 */

const { ipcMain } = require('electron');
const AddressUtils = require('../cardano/address-utils');
const CIP30Sim = require('../cardano/cip30-sim');
const logger = require('../app-logger');
const { v4: uuidv4 } = require('uuid');

// Generate Keypair
ipcMain.handle('generate-keypair', async (event) => {
  try {
    // Simulate keypair generation
    const keypair = {
      keypair_id: uuidv4(),
      publicKey: Buffer.from(uuidv4()).toString('hex').padEnd(64, '0'),
      privateKey: Buffer.from(uuidv4()).toString('hex').padEnd(64, '0'), // In real app, never expose this
      createdAt: Math.floor(Date.now() / 1000)
    };

    logger.info(`Keypair generated: ${keypair.keypair_id}`);

    return {
      success: true,
      data: keypair
    };
  } catch (err) {
    logger.error(`Generate keypair error: ${err.message}`);
    return {
      success: false,
      error: err.message
    };
  }
});

// Derive Address
ipcMain.handle('derive-address', async (event, data) => {
  try {
    const { publicKey, network } = data;

    if (!publicKey) {
      throw new Error('Public key is required');
    }

    // Simulate address derivation
    const address = {
      address_id: uuidv4(),
      address: `addr_test1vp${uuidv4().replace(/-/g, '').substring(0, 50)}`,
      publicKey: publicKey,
      network: network || 'testnet',
      derivedAt: Math.floor(Date.now() / 1000)
    };

    if (!AddressUtils.isValidAddress(address.address)) {
      logger.warn(`Generated address validation failed`);
    }

    logger.info(`Address derived from public key`);

    return {
      success: true,
      data: address
    };
  } catch (err) {
    logger.error(`Derive address error: ${err.message}`);
    return {
      success: false,
      error: err.message
    };
  }
});

// Export Wallet
ipcMain.handle('export-wallet', async (event, data) => {
  try {
    const { walletId, format } = data;

    if (!walletId) {
      throw new Error('Wallet ID is required');
    }

    const wallet = CIP30Sim.getWalletDetails(walletId);

    const exportData = {
      wallet_id: walletId,
      address: wallet.address,
      publicKey: wallet.publicKey,
      format: format || 'json',
      exportedAt: Math.floor(Date.now() / 1000),
      warning: 'Keep this file secure - it contains sensitive information'
    };

    logger.info(`Wallet exported: ${walletId}`);

    return {
      success: true,
      data: exportData
    };
  } catch (err) {
    logger.error(`Export wallet error: ${err.message}`);
    return {
      success: false,
      error: err.message
    };
  }
});

logger.info('Wallet IPC handlers registered');
