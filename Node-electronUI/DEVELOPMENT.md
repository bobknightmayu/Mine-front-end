# Development Quickstart

## Setup Environment

1. **Install Node.js and npm**
   ```bash
   # Use nvm (recommended)
   curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
   nvm install 18
   nvm use 18
   ```

2. **Verify installations**
   ```bash
   node --version  # v18+
   npm --version   # 9+
   ```

3. **Install dependencies**
   ```bash
   npm install
   ```

## Development Workflow

### Starting Development Server

```bash
# Terminal 1: Start Electron dev mode with hot reload
npm run dev
```

This automatically:
- Watches source files
- Rebuilds on changes
- Relaunches Electron
- Opens DevTools

### Building for Distribution

```bash
# Build all platforms
npm run dist

# Build specific platform
npm run dist -- --win
npm run dist -- --mac
npm run dist -- --linux
```

## Running CLI Tools

```bash
# Test signature verification
node cli/verify.js \
  --pubkey "a0a1a2a3a4a5a6a7a8a9b0b1b2b3b4b5b6b7b8b9c0c1c2c3c4c5c6c7c8c9" \
  --message "Hello Cardano" \
  --signature "d0d1d2d3d4d5d6d7d8d9e0e1e2e3e4e5e6e7e8e9f0f1f2f3f4f5f6f7f8f9"

# Generate challenge
node cli/challenge.js --community "test-community"

# Batch verify (create test file first)
node cli/batch-action.js --file batch-test.json --action verify

# Generate report
node cli/report.js --type user_registry --format csv
```

## Debugging

### Enable DevTools
- Built-in for development mode
- `Ctrl+Shift+I` (Windows/Linux) or `Cmd+Option+I` (macOS)

### Logging
- Check `logs/` directory for application logs
- Logs include main process and IPC calls
- Real-time logging in DevTools Console

### Common Issues

**Module not found**
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

**Port 3000 already in use**
```bash
# Change port in webpack.config.js or kill process
lsof -i :3000
kill -9 <PID>
```

**Electron won't start**
```bash
# Clear Electron cache
rm -rf ~/Library/Application\ Support/Electron-Mine-UI
npm start
```

## Testing

### Manual Testing Checklist

- [ ] Keypair generation works
- [ ] Message signing completes
- [ ] Signature verification displays result
- [ ] Challenge generation shows valid UUID
- [ ] Network switching persists
- [ ] Reports export to file
- [ ] CLI tools execute without errors

### Unit Tests (When Added)
```bash
npm test
```

## Performance Tips

1. **Disable DevTools in production**
   - Already disabled in build mode
   
2. **Lazy load heavy modules**
   - Cardano libraries loaded on demand
   
3. **Cache network responses**
   - Config caching implemented
   - Add more as needed

## Git Workflow

```bash
# Create feature branch
git checkout -b feature/my-feature

# Make changes and commit
git add .
git commit -m "feat: add my feature"

# Push to origin
git push origin feature/my-feature

# Create Pull Request on GitHub
```

## Useful npm Scripts

```bash
npm start          # Run Electron app
npm run dev        # Development with hot reload
npm run build      # Webpack build
npm run watch      # Webpack watch mode
npm run dist       # Build distributable
npm run lint       # Run linter
npm run test       # Run tests
```

## Environment Variables

Create `.env` file for sensitive config:

```env
BLOCKFROST_KEY_MAINNET=your_key_here
BLOCKFROST_KEY_TESTNET=your_key_here
BLOCKFROST_KEY_PREVIEW=your_key_here
```

Load in `src/main/app-config.js`:
```javascript
blockfrostKey: process.env.BLOCKFROST_KEY_TESTNET || ''
```

## Resources

- [Electron Quick Start](https://www.electronjs.org/docs/tutorial/quick-start)
- [Node.js Debug Guide](https://nodejs.org/en/docs/guides/debugging-getting-started/)
- [Chrome DevTools](https://developer.chrome.com/docs/devtools/)

---

**Happy coding!** 🚀
