/**
 * Main Application Entry Point
 * Handles routing and component rendering
 */

class CardanoMineUI {
  constructor() {
    this.currentPage = 'dashboard';
    this.config = null;
    this.init();
  }

  async init() {
    // Load configuration
    this.config = await window.electronAPI.getConfig();

    // Mount main app
    this.mount();

    // Setup event listeners
    this.setupListeners();
  }

  mount() {
    const root = document.getElementById('root');

    root.innerHTML = `
      <div class="app-container">
        <header class="header">
          <h1>🟣 Cardano Mine UI</h1>
          <nav class="header-nav">
            <a href="#" class="nav-link active" data-page="dashboard">Dashboard</a>
            <a href="#" class="nav-link" data-page="end-user">End User</a>
            <a href="#" class="nav-link" data-page="admin">Admin</a>
            <a href="#" class="nav-link" data-page="settings">Settings</a>
          </nav>
        </header>

        <div class="main-content">
          <aside class="sidebar" id="sidebar"></aside>
          <main class="content-area" id="content"></main>
        </div>
      </div>
    `;

    this.renderPage('dashboard');
  }

  setupListeners() {
    // Navigation
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const page = e.target.dataset.page;
        this.navigate(page);
      });
    });

    // Hash-based routing support
    window.addEventListener('hashchange', () => {
      const page = window.location.hash.substring(2) || 'dashboard';
      this.navigate(page);
    });
  }

  navigate(page) {
    this.currentPage = page;
    document.querySelectorAll('.nav-link').forEach(link => {
      link.classList.remove('active');
      if (link.dataset.page === page) {
        link.classList.add('active');
      }
    });
    this.renderPage(page);
  }

  renderPage(page) {
    const content = document.getElementById('content');
    const sidebar = document.getElementById('sidebar');

    switch (page) {
      case 'dashboard':
        content.innerHTML = this.getDashboardHTML();
        this.setupDashboard();
        break;
      case 'end-user':
        content.innerHTML = this.getEndUserHTML();
        this.setupEndUser();
        break;
      case 'admin':
        content.innerHTML = this.getAdminHTML();
        this.setupAdmin();
        break;
      case 'settings':
        content.innerHTML = this.getSettingsHTML();
        this.setupSettings();
        break;
      default:
        content.innerHTML = '<h1>Page not found</h1>';
    }
  }

  getDashboardHTML() {
    return `
      <div class="card">
        <h2>Welcome to Cardano Mine UI</h2>
        <p>A cross-platform application for Cardano community management and wallet operations.</p>
        
        <div style="margin-top: 1.5rem;">
          <h3>Quick Start</h3>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-top: 1rem;">
            <div class="card" style="margin: 0;">
              <h4>👤 End User Tools</h4>
              <p>Generate keys, sign messages, manage your wallet.</p>
              <a href="#end-user" class="btn btn-primary">Go to End User</a>
            </div>
            <div class="card" style="margin: 0;">
              <h4>👨‍💼 Admin Dashboard</h4>
              <p>Verify members, generate challenges, manage users.</p>
              <a href="#admin" class="btn btn-primary">Go to Admin</a>
            </div>
          </div>
        </div>

        <div style="margin-top: 2rem; padding: 1rem; background-color: var(--darker-bg); border-radius: var(--border-radius); border-left: 3px solid var(--primary-color);">
          <h4>📊 Current Network: <span id="current-network">Loading...</span></h4>
          <p id="network-info" style="color: var(--muted-text); margin: 0;"></p>
        </div>
      </div>
    `;
  }

  getEndUserHTML() {
    return `
      <div class="card">
        <h2>🔐 End User Tools</h2>
        <p>Manage your wallet and sign messages securely.</p>
      </div>

      <div class="card">
        <h3>1. Generate Keypair</h3>
        <button class="btn btn-primary" id="btn-generate-keypair">
          🔑 Generate Keypair
        </button>
        <pre id="keypair-output" style="background: var(--darker-bg); padding: 1rem; border-radius: var(--border-radius); margin-top: 1rem; display: none;"></pre>
      </div>

      <div class="card">
        <h3>2. Sign Message</h3>
        <div class="form-group">
          <label>Message to Sign</label>
          <textarea id="message-input" placeholder="Enter the message you want to sign..."></textarea>
        </div>
        <button class="btn btn-primary" id="btn-sign-message">
          ✍️ Sign Message
        </button>
        <pre id="signature-output" style="background: var(--darker-bg); padding: 1rem; border-radius: var(--border-radius); margin-top: 1rem; display: none;"></pre>
      </div>

      <div class="card">
        <h3>3. Export Wallet</h3>
        <button class="btn btn-primary" id="btn-export-wallet">
          📦 Export Wallet
        </button>
        <div id="export-output" style="margin-top: 1rem;"></div>
      </div>
    `;
  }

  getAdminHTML() {
    return `
      <div class="card">
        <h2>👨‍💼 Admin Dashboard</h2>
        <p>Manage community members and verify signatures.</p>
      </div>

      <div class="card">
        <h3>Generate Challenge</h3>
        <div class="form-group">
          <label>Community ID</label>
          <input type="text" id="community-id" placeholder="e.g., cardano-devs-ph">
        </div>
        <button class="btn btn-primary" id="btn-generate-challenge">
          ⚡ Generate Challenge
        </button>
        <pre id="challenge-output" style="background: var(--darker-bg); padding: 1rem; border-radius: var(--border-radius); margin-top: 1rem; display: none;"></pre>
      </div>

      <div class="card">
        <h3>Verify Signature</h3>
        <div class="form-group">
          <label>Public Key</label>
          <input type="text" id="public-key-input" placeholder="Hex-encoded public key">
        </div>
        <div class="form-group">
          <label>Message</label>
          <textarea id="verify-message-input" placeholder="Original message"></textarea>
        </div>
        <div class="form-group">
          <label>Signature</label>
          <textarea id="signature-input" placeholder="Hex-encoded signature"></textarea>
        </div>
        <button class="btn btn-primary" id="btn-verify-signature">
          ✅ Verify Signature
        </button>
        <div id="verification-output" style="margin-top: 1rem;"></div>
      </div>

      <div class="card">
        <h3>User Registry</h3>
        <button class="btn btn-primary" id="btn-get-registry">
          📋 Load Registry
        </button>
        <div id="registry-output" style="margin-top: 1rem;"></div>
      </div>
    `;
  }

  getSettingsHTML() {
    return `
      <div class="card">
        <h2>⚙️ Settings</h2>
      </div>

      <div class="card">
        <h3>Network Configuration</h3>
        <div class="form-group">
          <label>Select Network</label>
          <select id="network-select">
            <option value="mainnet">Mainnet</option>
            <option value="testnet" selected>Testnet</option>
            <option value="preview">Preview</option>
          </select>
        </div>
        <button class="btn btn-primary" id="btn-switch-network">
          🔄 Switch Network
        </button>
        <div id="network-output" style="margin-top: 1rem;"></div>
      </div>

      <div class="card">
        <h3>Application Info</h3>
        <p><strong>App Name:</strong> <span id="app-name">Cardano Mine UI</span></p>
        <p><strong>Version:</strong> <span id="app-version">1.0.0</span></p>
        <p><strong>Current Network:</strong> <span id="settings-network">testnet</span></p>
      </div>
    `;
  }

  setupDashboard() {
    window.electronAPI.getConfig().then(config => {
      document.getElementById('current-network').textContent = config.network.toUpperCase();
      document.getElementById('network-info').textContent = config.networks[config.network].description;
    });
  }

  setupEndUser() {
    document.getElementById('btn-generate-keypair').addEventListener('click', async () => {
      try {
        const result = await window.electronAPI.generateKeypair();
        if (result.success) {
          const output = document.getElementById('keypair-output');
          output.textContent = JSON.stringify(result.data, null, 2);
          output.style.display = 'block';
          this.showAlert('Keypair generated successfully!', 'success');
        }
      } catch (err) {
        this.showAlert(`Error: ${err.message}`, 'error');
      }
    });

    document.getElementById('btn-sign-message').addEventListener('click', async () => {
      try {
        const message = document.getElementById('message-input').value;
        if (!message) {
          this.showAlert('Please enter a message', 'error');
          return;
        }
        const result = await window.electronAPI.signMessage({ message });
        if (result.success) {
          const output = document.getElementById('signature-output');
          output.textContent = JSON.stringify(result.data, null, 2);
          output.style.display = 'block';
          this.showAlert('Message signed successfully!', 'success');
        }
      } catch (err) {
        this.showAlert(`Error: ${err.message}`, 'error');
      }
    });

    document.getElementById('btn-export-wallet').addEventListener('click', async () => {
      try {
        const result = await window.electronAPI.exportWallet({ walletId: 'test-wallet-1' });
        if (result.success) {
          const output = document.getElementById('export-output');
          output.innerHTML = `<pre>${JSON.stringify(result.data, null, 2)}</pre>`;
          this.showAlert('Wallet exported successfully!', 'success');
        }
      } catch (err) {
        this.showAlert(`Error: ${err.message}`, 'error');
      }
    });
  }

  setupAdmin() {
    document.getElementById('btn-generate-challenge').addEventListener('click', async () => {
      try {
        const communityId = document.getElementById('community-id').value;
        if (!communityId) {
          this.showAlert('Please enter a community ID', 'error');
          return;
        }
        const result = await window.electronAPI.generateChallenge({ communityId });
        if (result.success) {
          const output = document.getElementById('challenge-output');
          output.textContent = JSON.stringify(result.data, null, 2);
          output.style.display = 'block';
          this.showAlert('Challenge generated successfully!', 'success');
        }
      } catch (err) {
        this.showAlert(`Error: ${err.message}`, 'error');
      }
    });

    document.getElementById('btn-verify-signature').addEventListener('click', async () => {
      try {
        const publicKey = document.getElementById('public-key-input').value;
        const message = document.getElementById('verify-message-input').value;
        const signature = document.getElementById('signature-input').value;

        if (!publicKey || !message || !signature) {
          this.showAlert('Please fill all fields', 'error');
          return;
        }

        const result = await window.electronAPI.verifySignature({ publicKey, message, signature });
        if (result.success) {
          const output = document.getElementById('verification-output');
          const status = result.valid ? '✅ Valid' : '❌ Invalid';
          output.innerHTML = `<div class="alert ${result.valid ? 'alert-success' : 'alert-error'}">${status}: Signature is ${result.valid ? 'valid' : 'invalid'}</div>`;
          this.showAlert(`Signature verification: ${result.valid ? 'Valid' : 'Invalid'}`, result.valid ? 'success' : 'error');
        }
      } catch (err) {
        this.showAlert(`Error: ${err.message}`, 'error');
      }
    });

    document.getElementById('btn-get-registry').addEventListener('click', async () => {
      try {
        const result = await window.electronAPI.getUserRegistry();
        if (result.success) {
          const output = document.getElementById('registry-output');
          output.innerHTML = `
            <div class="card" style="margin: 0;">
              <h4>Total Users: ${result.data.totalUsers}</h4>
              <h4>Total Staked: ${result.data.totalStaked.toLocaleString()} lovelace</h4>
              <table class="table">
                <thead>
                  <tr>
                    <th>Address</th>
                    <th>Stake</th>
                    <th>Verified</th>
                  </tr>
                </thead>
                <tbody>
                  ${result.data.users.map(u => `
                    <tr>
                      <td>${u.address.substring(0, 20)}...</td>
                      <td>${(u.stake / 1000000).toFixed(2)} ADA</td>
                      <td>${u.verified ? '✅' : '❌'}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          `;
          this.showAlert('Registry loaded successfully!', 'success');
        }
      } catch (err) {
        this.showAlert(`Error: ${err.message}`, 'error');
      }
    });
  }

  setupSettings() {
    window.electronAPI.getConfig().then(config => {
      document.getElementById('network-select').value = config.network;
      document.getElementById('app-name').textContent = config.app.name;
      document.getElementById('app-version').textContent = config.app.version;
      document.getElementById('settings-network').textContent = config.network;
    });

    document.getElementById('btn-switch-network').addEventListener('click', async () => {
      try {
        const network = document.getElementById('network-select').value;
        const result = await window.electronAPI.switchNetwork(network);
        if (result.success) {
          document.getElementById('settings-network').textContent = network;
          const output = document.getElementById('network-output');
          output.innerHTML = `<div class="alert alert-success">✅ Switched to ${result.data.name}</div>`;
          this.showAlert(`Network switched to ${result.data.name}`, 'success');
        }
      } catch (err) {
        this.showAlert(`Error: ${err.message}`, 'error');
      }
    });
  }

  showAlert(message, type = 'info') {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type}`;
    alertDiv.innerHTML = `<span>${message}</span>`;
    
    const content = document.getElementById('content');
    content.insertBefore(alertDiv, content.firstChild);

    setTimeout(() => alertDiv.remove(), 3000);
  }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  new CardanoMineUI();
});
