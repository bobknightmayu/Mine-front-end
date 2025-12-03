/**
 * Input Validators
 * Common validation functions for forms
 */

class Validator {
  /**
   * Validate Cardano address
   */
  static isValidAddress(address) {
    if (!address || typeof address !== 'string') return false;
    return /^addr[^0O1]{7,}/.test(address);
  }

  /**
   * Validate hex string
   */
  static isValidHex(value, length = null) {
    if (!value || typeof value !== 'string') return false;
    const hexRegex = /^[0-9a-fA-F]*$/;
    if (!hexRegex.test(value)) return false;
    if (length && value.length !== length) return false;
    return true;
  }

  /**
   * Validate email
   */
  static isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Validate message (not empty)
   */
  static isValidMessage(message) {
    return message && message.trim().length > 0;
  }

  /**
   * Validate community ID format
   */
  static isValidCommunityId(communityId) {
    return /^[a-z0-9\-]+$/.test(communityId);
  }

  /**
   * Validate ADA amount
   */
  static isValidAmount(amount) {
    try {
      const num = parseFloat(amount);
      return num > 0 && num < 46000000000; // Max ADA supply
    } catch {
      return false;
    }
  }

  /**
   * Get validation error message
   */
  static getErrorMessage(field, type) {
    const messages = {
      address: 'Invalid Cardano address',
      hex: 'Invalid hexadecimal format',
      email: 'Invalid email address',
      message: 'Message cannot be empty',
      communityId: 'Community ID must contain only letters, numbers, and hyphens',
      amount: 'Invalid ADA amount'
    };
    return messages[type] || 'Invalid input';
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = Validator;
}
