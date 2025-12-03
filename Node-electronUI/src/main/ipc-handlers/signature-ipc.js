/**
 * Signature IPC Handlers
 * Handle all signature-related operations between renderer and main
 */

const { ipcMain } = require('electron');
const CardanoSigner = require('../cardano/signer');
const logger = require('../app-logger');

// Generate Challenge
ipcMain.handle('generate-challenge', async (event, data) => {
  try {
    const { communityId, action } = data;

    if (!communityId) {
      throw new Error('Community ID is required');
    }

    const challenge = CardanoSigner.generateChallenge(communityId, action || 'verify_membership');
    logger.info(`Challenge generated for ${communityId}`);

    return {
      success: true,
      data: challenge
    };
  } catch (err) {
    logger.error(`Generate challenge error: ${err.message}`);
    return {
      success: false,
      error: err.message
    };
  }
});

// Verify Signature
ipcMain.handle('verify-signature', async (event, data) => {
  try {
    const { publicKey, message, signature } = data;

    if (!publicKey || !message || !signature) {
      throw new Error('Public key, message, and signature are required');
    }

    const isValid = CardanoSigner.verifySignature(publicKey, message, signature);

    logger.info(`Signature verification result: ${isValid}`);

    return {
      success: true,
      valid: isValid,
      data: {
        publicKey: publicKey,
        message: message.substring(0, 50) + '...',
        timestamp: Math.floor(Date.now() / 1000)
      }
    };
  } catch (err) {
    logger.error(`Verify signature error: ${err.message}`);
    return {
      success: false,
      error: err.message
    };
  }
});

// Sign Message
ipcMain.handle('sign-message', async (event, data) => {
  try {
    const { message, walletId } = data;

    if (!message) {
      throw new Error('Message is required');
    }

    // Simulate signature creation
    const signature = {
      signature_id: require('uuid').v4(),
      message: message,
      timestamp: Math.floor(Date.now() / 1000),
      signed: true
    };

    logger.info(`Message signed successfully`);

    return {
      success: true,
      data: signature
    };
  } catch (err) {
    logger.error(`Sign message error: ${err.message}`);
    return {
      success: false,
      error: err.message
    };
  }
});

logger.info('Signature IPC handlers registered');
