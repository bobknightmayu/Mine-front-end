# Installation & Setup Guide

## System Requirements

- **Node.js**: 14.0 or higher
- **npm**: 6.0 or higher
- **OS**: Windows, macOS, or Linux
- **RAM**: Minimum 512MB
- **Disk Space**: ~500MB for dependencies + application

## Step-by-Step Installation

### 1. Prerequisites Setup

#### Windows
```powershell
# Install Chocolatey (if not installed)
Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))

# Install Node.js and npm
choco install nodejs
```

#### macOS
```bash
# Install Homebrew (if not installed)
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install Node.js
brew install node
```

#### Linux (Ubuntu/Debian)
```bash
# Update package manager
sudo apt update

# Install Node.js and npm
sudo apt install nodejs npm -y
```

### 2. Verify Installation

```bash
node --version    # Should be v14.0 or higher
npm --version     # Should be 6.0 or higher
```

### 3. Clone/Download Project

```bash
# Navigate to project directory
cd Node-electronUI

# Or download and extract the archive
```

### 4. Install Dependencies

```bash
# Install all project dependencies
npm install

# This will install:
# - electron (desktop framework)
# - electron-builder (packaging tool)
# - webpack (bundler)
# - uuid (unique ID generation)
# - sodium-plus (crypto library)
# - And other dependencies
```

### 5. Run Development Version

```bash
# Start development server with hot reload
npm run dev

# Or run without rebuilding
npm start
```

The application should launch automatically. If not, open `http://localhost:3000` in your browser.

### 6. Build for Distribution

```bash
# Build for your operating system
npm run dist

# Or specify platform:
npm run dist -- --win      # Windows
npm run dist -- --mac      # macOS  
npm run dist -- --linux    # Linux
```

Built files will be in the `dist/` directory.

## Troubleshooting

### Problem: "npm: command not found"
**Solution**: Node.js/npm not installed or not in PATH
```bash
# Reinstall Node.js from https://nodejs.org
# Or use nvm: curl https://get.nvm.sh | bash
```

### Problem: "Cannot find module 'electron'"
**Solution**: Dependencies not installed
```bash
# Clean install
rm -rf node_modules package-lock.json
npm install
```

### Problem: Port 3000 already in use
**Solution**: Kill the process or change port
```bash
# Linux/macOS
lsof -i :3000
kill -9 <PID>

# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### Problem: Application won't start
**Solution**: Check logs and clear cache
```bash
# View recent logs
tail -f logs/app-*.log

# Clear Electron cache (varies by OS)
rm -rf ~/.cache/electron  # Linux
rm -rf ~/Library/Application\ Support/Electron  # macOS
del %APPDATA%\Electron  # Windows
```

## Configuration

### Network Configuration

Create or edit `config/app-config.json`:

```json
{
  "network": "testnet",
  "networks": {
    "mainnet": {
      "name": "Mainnet",
      "kupoUrl": "https://kupo.blockfrost.io",
      "ogmiosUrl": "wss://ogmios.blockfrost.io"
    },
    "testnet": {
      "name": "Testnet",
      "kupoUrl": "https://kupo.blockfrost.io?network=testnet",
      "ogmiosUrl": "wss://ogmios.blockfrost.io?network=testnet"
    }
  }
}
```

### Environment Variables

Create `.env` file for sensitive data:

```env
BLOCKFROST_KEY_MAINNET=your_mainnet_key
BLOCKFROST_KEY_TESTNET=your_testnet_key
BLOCKFROST_KEY_PREVIEW=your_preview_key
```

## First Run Checklist

- [ ] Application launches without errors
- [ ] No errors in console/logs
- [ ] Dashboard page loads
- [ ] Can navigate between tabs
- [ ] Settings page shows current network
- [ ] All buttons are clickable

## CLI Tools Setup

Make CLI scripts executable:

```bash
# Linux/macOS
chmod +x cli/*.js

# Test CLI
node cli/challenge.js --help
node cli/verify.js --help
node cli/report.js --help
```

## Upgrading

To update to a newer version:

```bash
# Pull latest changes
git pull origin main

# Reinstall dependencies
npm install

# Run again
npm run dev
```

## Uninstallation

```bash
# Remove application
rm -rf Node-electronUI

# Remove user data (optional)
# Linux: ~/.config/Electron
# macOS: ~/Library/Application Support/Electron
# Windows: %APPDATA%\Electron
```

## Getting Help

- **Documentation**: See `README.md` and `DEVELOPMENT.md`
- **Issues**: Check GitHub Issues
- **Logs**: Check `logs/` directory
- **Community**: Cardano Developer Community

## Next Steps

1. Read `README.md` for feature overview
2. Check `DEVELOPMENT.md` for development workflow
3. Explore the GUI
4. Try CLI tools
5. Customize configuration for your needs

---

**Installation Complete!** 🎉

You're now ready to use Cardano Mine UI.
