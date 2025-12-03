# Cardano Mine UI - Node.js/Electron Version

A cross-platform desktop application for Cardano community management and wallet operations, built with Node.js and Electron.

## 🎯 Features

### End User Tools
- 🔑 Generate Keypairs
- ✍️ Sign Messages
- 📦 Export Wallets
- ✅ Verify Signatures

### Admin Dashboard
- ⚡ Generate Signing Challenges
- ✔️ Verify Signatures
- 👥 Manage User Registry
- 📊 Export Reports
- 🔗 On-Chain Verification

### Security
- Context isolation between processes
- Secure IPC handlers
- Local signing capabilities
- CIP-30 wallet support (planned)

## 📁 Project Structure

```
Node-electronUI/
│
├── package.json                  # Project dependencies
├── electron.js                   # Main Electron process
├── preload.js                    # Secure bridge to frontend
│
├── src/
│   ├── main/
│   │   ├── app-config.js         # Configuration management
│   │   ├── app-logger.js         # Logging system
│   │   ├── ipc-handlers/         # IPC request handlers
│   │   │   ├── signature-ipc.js  # Signature operations
│   │   │   ├── wallet-ipc.js     # Wallet operations
│   │   │   └── admin-ipc.js      # Admin operations
│   │   ├── cardano/              # Cardano cryptography
│   │   │   ├── signer.js         # Ed25519 signing
│   │   │   ├── address-utils.js  # Address validation
│   │   │   ├── transaction-utils.js
│   │   │   └── cip30-sim.js      # CIP-30 simulator
│   │   └── scripts/              # CLI script generators
│   │
│   └── renderer/                 # Frontend UI
│       ├── index.html            # HTML entry point
│       ├── app.js                # Main app logic
│       ├── styles/
│       │   └── app.css           # Unified styling
│       ├── components/           # Component modules
│       └── utils/                # Utility functions
│
├── cli/                          # Command-line tools
│   ├── verify.js                 # Verify signatures
│   ├── challenge.js              # Generate challenges
│   ├── batch-action.js           # Batch operations
│   └── report.js                 # Generate reports
│
├── config/                       # Configuration files
│   └── app-config.json          # Runtime config
│
├── dist/                         # Build output
├── resources/                    # Static assets
│   ├── icons/                    # App icons
│   └── templates/                # Report templates
│
├── webpack.config.js             # Bundler configuration
├── electron-builder.json         # Build configuration
└── README.md                      # This file
```

## 🚀 Getting Started

### Prerequisites
- Node.js 14+ 
- npm or yarn
- Git

### Installation

1. **Clone and navigate**
   ```bash
   cd Node-electronUI
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Install additional dependencies (if needed)**
   ```bash
   npm install --save electron-is-dev blake2b
   ```

### Development

**Run in development mode:**
```bash
npm run dev
```

This will:
- Start webpack in watch mode
- Launch Electron with hot reload
- Open DevTools for debugging

**Run Electron only:**
```bash
npm start
```

### Building

**Create distributable:**
```bash
npm run build
npm run dist
```

Output will be in the `dist/` directory.

**Platform-specific builds:**
```bash
# Windows
npm run dist -- --win

# macOS
npm run dist -- --mac

# Linux
npm run dist -- --linux
```

## 🔧 Configuration

Configuration is stored in `config/app-config.json`:

```json
{
  "network": "testnet",
  "networks": {
    "mainnet": { ... },
    "testnet": { ... },
    "preview": { ... }
  },
  "app": { ... },
  "logging": { ... }
}
```

Switch networks programmatically via UI Settings or CLI:
```bash
# In app: Settings → Select Network → Switch
```

## 📡 IPC API

Frontend communicates with main process via IPC handlers:

### Signature Operations
```javascript
// Generate challenge
await window.electronAPI.generateChallenge({
  communityId: "cardano-devs-ph",
  action: "verify_membership"
});

// Verify signature
await window.electronAPI.verifySignature({
  publicKey: "a0a1a2a3...",
  message: "Hello",
  signature: "d0d1d2d3..."
});

// Sign message
await window.electronAPI.signMessage({
  message: "Hello Cardano"
});
```

### Wallet Operations
```javascript
// Generate keypair
await window.electronAPI.generateKeypair();

// Derive address
await window.electronAPI.deriveAddress({
  publicKey: "a0a1a2a3...",
  network: "testnet"
});

// Export wallet
await window.electronAPI.exportWallet({
  walletId: "test-wallet-1"
});
```

### Admin Operations
```javascript
// Verify on-chain
await window.electronAPI.verifyOnChain({
  address: "addr_test1vp...",
  stakeAmount: 1000000
});

// Get user registry
await window.electronAPI.getUserRegistry();

// Export report
await window.electronAPI.exportReport({
  reportType: "user_registry",
  format: "csv"
});
```

## 🛠️ CLI Tools

### Verify Signature
```bash
node cli/verify.js \
  --pubkey a0a1a2a3... \
  --message "Hello" \
  --signature d0d1d2d3...
```

### Generate Challenge
```bash
node cli/challenge.js \
  --community "cardano-devs-ph" \
  --action "verify_membership"
```

### Batch Processing
```bash
node cli/batch-action.js \
  --file batch-verify.json \
  --action verify \
  --output results.json
```

### Export Report
```bash
node cli/report.js \
  --type user_registry \
  --format csv \
  --output report.csv
```

## 📊 Data Formats

### Challenge Format
```json
{
  "challenge_id": "uuid",
  "community_id": "cardano-devs-ph",
  "nonce": "random-hex",
  "timestamp": 1733043600,
  "action": "verify_membership",
  "message": "I hereby verify...",
  "expiry": 1733047200
}
```

### Signature Format
```json
{
  "signature_id": "uuid",
  "challenge_id": "uuid",
  "wallet_address": "addr_test1vp...",
  "public_key": "hex-string",
  "signature": "hex-string",
  "timestamp": 1733043700,
  "message_hash": "hex-string",
  "signing_method": "offline"
}
```

## 🔐 Security Considerations

- ✅ Context isolation enabled
- ✅ Node integration disabled
- ✅ Secure preload script
- ✅ IPC validation
- ✅ Local signing (no key transmission)
- ✅ HTTPS for external APIs
- ⚠️ Private keys never exported (UI only shows public keys)

## 🚧 Roadmap

- [ ] CIP-30 Wallet Integration
- [ ] Hardware Wallet Support (Ledger, Trezor)
- [ ] Multi-signature Support
- [ ] On-chain Verification Integration
- [ ] Advanced Report Generation
- [ ] Batch User Import
- [ ] WebAssembly Cardano Library Integration

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📝 License

MIT License - see LICENSE file for details

## 🆘 Support

- **Documentation**: See this README and inline code comments
- **Issues**: Use GitHub Issues for bug reports
- **Community**: Cardano Developer Community Philippines

## 📚 Additional Resources

- [Electron Documentation](https://www.electronjs.org/docs)
- [Cardano Documentation](https://developers.cardano.org/)
- [Node.js Best Practices](https://nodejs.org/en/docs/)
- [CIP-30 Specification](https://cips.cardano.org/cips/cip30/)

---

**Built with ❤️ for the Cardano Community**
