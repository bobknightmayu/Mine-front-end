/**
 * Electron Main Process
 * Manages window creation, menu, and main application lifecycle
 */

const { app, BrowserWindow, Menu } = require('electron');
const path = require('path');
const isDev = require('electron-is-dev');
const logger = require('./src/main/app-logger');

// Keep a global reference of the window object
let mainWindow;
let adminWindow;

// Check if running in headless environment
const isHeadless = process.env.DISPLAY === '' || process.env.DISPLAY === undefined;

// Exit immediately in headless mode before Electron tries to load GUI libraries
if (isHeadless) {
  console.log('\n🖥️  Headless environment detected - Electron GUI not available');
  console.log('\n📝 Available CLI tools:');
  console.log('   npm run cli:challenge -- --community "example"');
  console.log('   npm run cli:verify -- --pubkey xxx --message yyy --signature zzz');
  console.log('   npm run cli:batch -- --file batch.json --action verify');
  console.log('   npm run cli:report -- --type user_registry --format json');
  console.log('\n✨ For GUI mode, run on a machine with a display:\n   npm run dev\n');
  process.exit(0);
}

/**
 * Create the main application window
 */
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      preload: path.join(__dirname, 'preload.js')
    },
    icon: path.join(__dirname, 'resources/icons/app.png')
  });

  const startUrl = isDev
    ? 'http://localhost:3000'
    : `file://${path.join(__dirname, '../build/index.html')}`;

  mainWindow.loadURL(startUrl);

  if (isDev) {
    mainWindow.webContents.openDevTools();
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  logger.info('Main window created');
}

/**
 * Create admin dashboard window
 */
function createAdminWindow() {
  if (!mainWindow) {
    logger.info('Main window required for admin window');
    return;
  }

  if (adminWindow) {
    adminWindow.focus();
    return;
  }

  adminWindow = new BrowserWindow({
    width: 1000,
    height: 700,
    parent: mainWindow,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      preload: path.join(__dirname, 'preload.js')
    },
    icon: path.join(__dirname, 'resources/icons/admin.png')
  });

  const adminUrl = isDev
    ? 'http://localhost:3000/#/admin'
    : `file://${path.join(__dirname, '../build/index.html')}#/admin`;

  adminWindow.loadURL(adminUrl);

  if (isDev) {
    adminWindow.webContents.openDevTools();
  }

  adminWindow.on('closed', () => {
    adminWindow = null;
  });

  logger.info('Admin window created');
}

/**
 * Create application menu
 */
function createMenu() {
  const template = [
    {
      label: 'File',
      submenu: [
        {
          label: 'Exit',
          accelerator: 'CmdOrCtrl+Q',
          click: () => {
            app.quit();
          }
        }
      ]
    },
    {
      label: 'View',
      submenu: [
        {
          label: 'Reload',
          accelerator: 'CmdOrCtrl+R',
          click: () => {
            if (mainWindow) mainWindow.webContents.reload();
          }
        },
        {
          label: 'Toggle DevTools',
          accelerator: 'CmdOrCtrl+Shift+I',
          click: () => {
            if (mainWindow) mainWindow.webContents.toggleDevTools();
          }
        }
      ]
    },
    {
      label: 'Tools',
      submenu: [
        {
          label: 'Admin Dashboard',
          click: () => {
            createAdminWindow();
          }
        }
      ]
    },
    {
      label: 'Help',
      submenu: [
        {
          label: 'About',
          click: () => {
            logger.info('About dialog requested');
          }
        }
      ]
    }
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

/**
 * App event handlers
 */
app.on('ready', () => {
  createWindow();
  createMenu();
  logger.info('Application started');
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null && !isHeadless) {
    createWindow();
  }
});

// Register IPC handlers
require('./src/main/ipc-handlers/signature-ipc');
require('./src/main/ipc-handlers/wallet-ipc');
require('./src/main/ipc-handlers/admin-ipc');

logger.info('Electron app initialized');
