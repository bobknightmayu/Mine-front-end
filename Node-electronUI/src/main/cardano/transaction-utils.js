/**
 * Cardano Transaction Utils
 * Build and serialize transactions
 */

const logger = require('../app-logger');

class TransactionUtils {
  /**
   * Validate transaction structure
   */
  static validateTransaction(tx) {
    try {
      if (!tx || typeof tx !== 'object') {
        throw new Error('Invalid transaction object');
      }

      const required = ['inputs', 'outputs', 'fee'];
      for (const field of required) {
        if (!(field in tx)) {
          throw new Error(`Missing required field: ${field}`);
        }
      }

      if (!Array.isArray(tx.inputs) || tx.inputs.length === 0) {
        throw new Error('Transaction must have at least one input');
      }

      if (!Array.isArray(tx.outputs) || tx.outputs.length === 0) {
        throw new Error('Transaction must have at least one output');
      }

      return true;
    } catch (err) {
      logger.error(`Transaction validation error: ${err.message}`);
      throw err;
    }
  }

  /**
   * Calculate transaction size
   */
  static calculateTxSize(tx) {
    try {
      // Simplified size calculation
      const serialized = JSON.stringify(tx);
      return Buffer.byteLength(serialized, 'utf8');
    } catch (err) {
      logger.error(`Transaction size calculation error: ${err.message}`);
      return 0;
    }
  }

  /**
   * Estimate transaction fee
   */
  static estimateFee(tx, feePerByte = 44) {
    try {
      const size = this.calculateTxSize(tx);
      const baseFee = 155000; // Cardano minimum fee
      const estimatedFee = baseFee + (size * feePerByte);
      return estimatedFee;
    } catch (err) {
      logger.error(`Fee estimation error: ${err.message}`);
      return 155000; // Return minimum fee on error
    }
  }

  /**
   * Build a simple transaction
   */
  static buildTransaction(inputs, outputs, fee, metadata = null) {
    try {
      const tx = {
        inputs: inputs,
        outputs: outputs,
        fee: fee,
        ttl: Math.floor(Date.now() / 1000) + 7200 // 2 hours
      };

      if (metadata) {
        tx.metadata = metadata;
      }

      this.validateTransaction(tx);
      logger.info(`Transaction built with ${inputs.length} input(s) and ${outputs.length} output(s)`);
      return tx;
    } catch (err) {
      logger.error(`Transaction build error: ${err.message}`);
      throw err;
    }
  }
}

module.exports = TransactionUtils;
