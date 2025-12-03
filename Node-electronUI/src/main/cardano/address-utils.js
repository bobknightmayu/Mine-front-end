/**
 * Cardano Address Utils
 * Derive and validate Cardano addresses
 */

const logger = require('../app-logger');

class AddressUtils {
  /**
   * Validate Cardano address format (Bech32)
   */
  static isValidAddress(address) {
    try {
      if (!address || typeof address !== 'string') {
        return false;
      }

      // Cardano addresses start with addr1 (mainnet) or addr_test (testnet)
      if (!address.startsWith('addr1') && !address.startsWith('addr_test')) {
        logger.warn(`Invalid address prefix: ${address.substring(0, 10)}`);
        return false;
      }

      // Basic Bech32 validation - proper implementation would decode completely
      const bech32Regex = /^addr[^0O1]{7,}/;
      return bech32Regex.test(address);
    } catch (err) {
      logger.error(`Address validation error: ${err.message}`);
      return false;
    }
  }

  /**
   * Derive stake address from payment address
   * Note: Real implementation would use cardano-addresses library
   */
  static deriveStakeAddress(paymentAddress, network = 'testnet') {
    try {
      if (!this.isValidAddress(paymentAddress)) {
        throw new Error('Invalid payment address');
      }

      // Placeholder - real implementation uses cardano-addresses
      const isMainnet = paymentAddress.startsWith('addr1');
      const prefix = isMainnet ? 'stake1' : 'stake_test1';

      // In reality, you'd extract the stake portion from the address
      logger.info(`Deriving stake address for: ${paymentAddress.substring(0, 20)}...`);

      return `${prefix}${Math.random().toString(36).substring(2, 20)}`;
    } catch (err) {
      logger.error(`Address derivation error: ${err.message}`);
      throw err;
    }
  }

  /**
   * Get address type (payment or stake)
   */
  static getAddressType(address) {
    if (address.startsWith('addr1') || address.startsWith('addr_test')) {
      return 'payment';
    } else if (address.startsWith('stake1') || address.startsWith('stake_test')) {
      return 'stake';
    }
    return 'unknown';
  }

  /**
   * Extract network from address
   */
  static getNetworkFromAddress(address) {
    if (address.startsWith('addr1') || address.startsWith('stake1')) {
      return 'mainnet';
    } else if (address.startsWith('addr_test') || address.startsWith('stake_test')) {
      return 'testnet';
    }
    return 'unknown';
  }
}

module.exports = AddressUtils;
