/**
 * Admin IPC Handlers
 * Handle admin-specific operations
 */

const { ipcMain } = require('electron');
const logger = require('../app-logger');
const config = require('../app-config');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const path = require('path');

// Verify On-Chain
ipcMain.handle('verify-onchain', async (event, data) => {
  try {
    const { address, stakeAmount } = data;

    if (!address) {
      throw new Error('Address is required');
    }

    // Simulate on-chain verification
    const verification = {
      verification_id: uuidv4(),
      address: address,
      stakeAmount: stakeAmount || 0,
      verified: true,
      timestamp: Math.floor(Date.now() / 1000),
      blockNumber: Math.floor(Math.random() * 10000000)
    };

    logger.info(`On-chain verification completed for: ${address.substring(0, 20)}...`);

    return {
      success: true,
      data: verification
    };
  } catch (err) {
    logger.error(`On-chain verification error: ${err.message}`);
    return {
      success: false,
      error: err.message
    };
  }
});

// Get User Registry
ipcMain.handle('get-user-registry', async (event) => {
  try {
    // Simulate registry data
    const registry = {
      registry_id: uuidv4(),
      totalUsers: Math.floor(Math.random() * 1000),
      totalStaked: Math.floor(Math.random() * 1000000),
      users: [
        {
          id: uuidv4(),
          address: 'addr_test1vp1234567890abcdef',
          joinedAt: Math.floor(Date.now() / 1000) - 86400,
          stake: 1000000,
          verified: true
        },
        {
          id: uuidv4(),
          address: 'addr_test1vq0987654321abcdef',
          joinedAt: Math.floor(Date.now() / 1000) - 172800,
          stake: 5000000,
          verified: true
        }
      ],
      lastUpdated: Math.floor(Date.now() / 1000)
    };

    logger.info(`User registry retrieved: ${registry.users.length} users`);

    return {
      success: true,
      data: registry
    };
  } catch (err) {
    logger.error(`Get user registry error: ${err.message}`);
    return {
      success: false,
      error: err.message
    };
  }
});

// Export Report
ipcMain.handle('export-report', async (event, data) => {
  try {
    const { format, reportType } = data;

    if (!reportType) {
      throw new Error('Report type is required');
    }

    const reportData = {
      report_id: uuidv4(),
      type: reportType,
      format: format || 'csv',
      content: `Report: ${reportType}\nGenerated: ${new Date().toISOString()}\n\n[Report data here]`,
      generatedAt: Math.floor(Date.now() / 1000)
    };

    // Ensure reports directory exists
    const reportsDir = path.join(config.getAppConfig().dataDir, 'reports');
    if (!fs.existsSync(reportsDir)) {
      fs.mkdirSync(reportsDir, { recursive: true });
    }

    // Save report to file
    const fileName = `report-${reportData.report_id}.${format || 'csv'}`;
    const filePath = path.join(reportsDir, fileName);
    fs.writeFileSync(filePath, reportData.content);

    logger.info(`Report exported: ${fileName}`);

    return {
      success: true,
      data: {
        ...reportData,
        filePath: filePath
      }
    };
  } catch (err) {
    logger.error(`Export report error: ${err.message}`);
    return {
      success: false,
      error: err.message
    };
  }
});

// Get Config
ipcMain.handle('get-config', async (event) => {
  try {
    const appConfig = config.getAll();
    return {
      success: true,
      data: appConfig
    };
  } catch (err) {
    logger.error(`Get config error: ${err.message}`);
    return {
      success: false,
      error: err.message
    };
  }
});

// Switch Network
ipcMain.handle('switch-network', async (event, network) => {
  try {
    const newNetworkConfig = config.switchNetwork(network);
    logger.info(`Network switched to: ${network}`);

    return {
      success: true,
      data: newNetworkConfig
    };
  } catch (err) {
    logger.error(`Switch network error: ${err.message}`);
    return {
      success: false,
      error: err.message
    };
  }
});

// Logging
ipcMain.handle('log', async (event, data) => {
  const { level, message } = data;
  if (logger[level]) {
    logger[level](message);
  }
  return { success: true };
});

logger.info('Admin IPC handlers registered');
