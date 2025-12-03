/**
 * Application Configuration
 * Centralized config for network, endpoints, and settings
 */

const fs = require('fs');
const path = require('path');

// Config file location
const configDir = path.join(__dirname, '../../config');
const configFile = path.join(configDir, 'app-config.json');

// Ensure config directory exists
if (!fs.existsSync(configDir)) {
  fs.mkdirSync(configDir, { recursive: true });
}

// Default configuration
const defaultConfig = {
  network: 'testnet',
  networks: {
    mainnet: {
      name: 'Mainnet',
      kupoUrl: 'https://kupo.blockfrost.io',
      ogmiosUrl: 'wss://ogmios.blockfrost.io',
      blockfrostKey: process.env.BLOCKFROST_KEY_MAINNET || '',
      description: 'Cardano Mainnet'
    },
    testnet: {
      name: 'Testnet',
      kupoUrl: 'https://kupo.blockfrost.io?network=testnet',
      ogmiosUrl: 'wss://ogmios.blockfrost.io?network=testnet',
      blockfrostKey: process.env.BLOCKFROST_KEY_TESTNET || '',
      description: 'Cardano Preprod Testnet'
    },
    preview: {
      name: 'Preview',
      kupoUrl: 'https://kupo.blockfrost.io?network=preview',
      ogmiosUrl: 'wss://ogmios.blockfrost.io?network=preview',
      blockfrostKey: process.env.BLOCKFROST_KEY_PREVIEW || '',
      description: 'Cardano Preview Testnet'
    }
  },
  app: {
    name: 'Cardano Mine UI',
    version: '1.0.0',
    maxSignatureAge: 3600, // 1 hour in seconds
    challengeExpiry: 3600,
    dataDir: path.join(__dirname, '../../data')
  },
  logging: {
    level: 'info',
    file: true,
    console: true
  }
};

class Config {
  constructor() {
    this.config = this.loadConfig();
  }

  /**
   * Load config from file or create default
   */
  loadConfig() {
    try {
      if (fs.existsSync(configFile)) {
        const data = fs.readFileSync(configFile, 'utf8');
        return JSON.parse(data);
      }
    } catch (err) {
      console.error('Error reading config file:', err);
    }

    // Return and save default config
    this.saveConfig(defaultConfig);
    return defaultConfig;
  }

  /**
   * Save config to file
   */
  saveConfig(config) {
    try {
      fs.writeFileSync(configFile, JSON.stringify(config, null, 2), 'utf8');
    } catch (err) {
      console.error('Error saving config file:', err);
    }
  }

  /**
   * Get entire config
   */
  getAll() {
    return this.config;
  }

  /**
   * Get network config
   */
  getNetworkConfig(network) {
    const net = network || this.config.network;
    return this.config.networks[net] || this.config.networks.testnet;
  }

  /**
   * Get current active network
   */
  getCurrentNetwork() {
    return this.config.network;
  }

  /**
   * Switch network
   */
  switchNetwork(network) {
    if (!this.config.networks[network]) {
      throw new Error(`Unknown network: ${network}`);
    }
    this.config.network = network;
    this.saveConfig(this.config);
    return this.config.networks[network];
  }

  /**
   * Get app config
   */
  getAppConfig() {
    return this.config.app;
  }

  /**
   * Get logging config
   */
  getLoggingConfig() {
    return this.config.logging;
  }
}

module.exports = new Config();
