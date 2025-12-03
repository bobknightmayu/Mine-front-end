/**
 * Preload Script
 * Secure bridge between renderer and main process
 * Exposes only necessary APIs to frontend
 */

const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  // Signature operations
  generateChallenge: (data) => ipcRenderer.invoke('generate-challenge', data),
  verifySignature: (data) => ipcRenderer.invoke('verify-signature', data),
  signMessage: (data) => ipcRenderer.invoke('sign-message', data),

  // Wallet operations
  generateKeypair: () => ipcRenderer.invoke('generate-keypair'),
  deriveAddress: (data) => ipcRenderer.invoke('derive-address', data),
  exportWallet: (data) => ipcRenderer.invoke('export-wallet', data),

  // Admin operations
  verifyOnChain: (data) => ipcRenderer.invoke('verify-onchain', data),
  getUserRegistry: () => ipcRenderer.invoke('get-user-registry'),
  exportReport: (data) => ipcRenderer.invoke('export-report', data),

  // Config
  getConfig: () => ipcRenderer.invoke('get-config'),
  switchNetwork: (network) => ipcRenderer.invoke('switch-network', network),

  // Logging
  log: (level, message) => ipcRenderer.invoke('log', { level, message })
});
