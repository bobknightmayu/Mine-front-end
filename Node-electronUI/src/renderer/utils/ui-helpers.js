/**
 * UI Helper Utilities
 * Common functions for frontend components
 */

class UIHelpers {
  /**
   * Format ADA amount from lovelace
   */
  static formatADA(lovelace) {
    return (lovelace / 1000000).toFixed(2);
  }

  /**
   * Truncate address for display
   */
  static truncateAddress(address, length = 20) {
    if (address.length <= length) return address;
    return address.substring(0, length / 2) + '...' + address.substring(address.length - length / 2);
  }

  /**
   * Format timestamp to readable date
   */
  static formatDate(timestamp) {
    return new Date(timestamp * 1000).toLocaleString();
  }

  /**
   * Copy to clipboard
   */
  static async copyToClipboard(text) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (err) {
      console.error('Copy failed:', err);
      return false;
    }
  }

  /**
   * Download JSON as file
   */
  static downloadJSON(data, filename) {
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(data, null, 2)));
    element.setAttribute('download', filename);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  }

  /**
   * Generate random ID
   */
  static generateId() {
    return Math.random().toString(36).substring(2, 11);
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = UIHelpers;
}
