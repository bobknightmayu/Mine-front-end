# Architecture Overview

## System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                   Electron Main Process                  │
│  ┌───────────────────────────────────────────────────┐  │
│  │          Application Lifecycle Manager             │  │
│  │  - Window Management                              │  │
│  │  - Menu Management                                │  │
│  │  - IPC Message Router                             │  │
│  └───────────────────────────────────────────────────┘  │
│                          ↓↑                              │
│  ┌───────────────────────────────────────────────────┐  │
│  │        Business Logic & Core Modules              │  │
│  │  - Config Management (app-config.js)              │  │
│  │  - Logging System (app-logger.js)                 │  │
│  │  - Cardano Cryptography (cardano/)                │  │
│  │    ├─ Signer (signature generation/verification)  │  │
│  │    ├─ Address Utils (validation/derivation)       │  │
│  │    ├─ Transaction Utils (building/validation)     │  │
│  │    └─ CIP-30 Simulator (wallet mock)              │  │
│  └───────────────────────────────────────────────────┘  │
│                          ↓↑                              │
│  ┌───────────────────────────────────────────────────┐  │
│  │           IPC Handlers (secure bridge)             │  │
│  │  - signature-ipc.js (challenge, verify, sign)     │  │
│  │  - wallet-ipc.js (keygen, derive, export)        │  │
│  │  - admin-ipc.js (verify-onchain, registry, etc)  │  │
│  └───────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
         ↓↑(Secure IPC, Context Isolated)↑↓
┌─────────────────────────────────────────────────────────┐
│              Renderer Process (Frontend)                 │
│  ┌───────────────────────────────────────────────────┐  │
│  │           Preload Script (preload.js)             │  │
│  │  - Bridges to electronAPI                         │  │
│  │  - Context isolation enforced                     │  │
│  └───────────────────────────────────────────────────┘  │
│                          ↓↑                              │
│  ┌───────────────────────────────────────────────────┐  │
│  │         Application UI (app.js)                   │  │
│  │  - Page Router                                    │  │
│  │  - Component Lifecycle                           │  │
│  │  - Event Handlers                                │  │
│  └───────────────────────────────────────────────────┘  │
│                          ↓↑                              │
│  ┌───────────────────────────────────────────────────┐  │
│  │      UI Components & Utilities                    │  │
│  │  - Dashboard                                      │  │
│  │  - End User Tools                                 │  │
│  │  - Admin Dashboard                               │  │
│  │  - Settings                                       │  │
│  └───────────────────────────────────────────────────┘  │
│                          ↓↑                              │
│  ┌───────────────────────────────────────────────────┐  │
│  │      Styling & Utilities                          │  │
│  │  - app.css (unified dark theme)                   │  │
│  │  - ui-helpers.js (utility functions)              │  │
│  │  - validator.js (input validation)                │  │
│  └───────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
         ↓↑(Standard Web APIs, electronAPI)↑↓
┌─────────────────────────────────────────────────────────┐
│              HTML Document (index.html)                  │
│  - DOM root element                                     │
│  - Style links                                          │
│  - Script entry points                                  │
└─────────────────────────────────────────────────────────┘
```

## Module Dependencies

### Core Module Graph

```
┌─ electron.js (Entry Point)
│   ├─ app-config.js (Configuration)
│   ├─ app-logger.js (Logging)
│   │
│   └─ IPC Handlers
│       ├─ signature-ipc.js
│       │   └─ cardano/signer.js
│       │
│       ├─ wallet-ipc.js
│       │   ├─ cardano/address-utils.js
│       │   ├─ cardano/cip30-sim.js
│       │   └─ app-logger.js
│       │
│       └─ admin-ipc.js
│           ├─ app-config.js
│           └─ app-logger.js
│
└─ CLI Scripts
    ├─ cli/verify.js → cardano/signer.js
    ├─ cli/challenge.js → cardano/signer.js
    ├─ cli/batch-action.js → cardano/signer.js
    └─ cli/report.js → file system
```

## Data Flow

### Signature Generation Flow

```
User UI
  ↓
[Sign Message Form]
  ↓
window.electronAPI.signMessage()
  ↓
[Preload IPC]
  ↓
signature-ipc.js (sign-message handler)
  ↓
CardanoSigner.createSignatureObject()
  ↓
Return to UI
  ↓
Display Result
```

### Challenge Generation Flow

```
Admin UI
  ↓
[Generate Challenge Form]
  ↓
window.electronAPI.generateChallenge()
  ↓
[Preload IPC]
  ↓
signature-ipc.js (generate-challenge handler)
  ↓
CardanoSigner.generateChallenge()
  ↓
Return Challenge with UUID, nonce, expiry
  ↓
Display/Export Challenge
```

### Signature Verification Flow

```
Admin UI
  ↓
[Signature Fields]
  ↓
window.electronAPI.verifySignature()
  ↓
[Preload IPC]
  ↓
signature-ipc.js (verify-signature handler)
  ↓
CardanoSigner.verifySignature()
  ↓
[Local verification or external service]
  ↓
Return validity status
  ↓
Display result (✓ Valid / ✗ Invalid)
```

## Process Communication

### IPC Protocol

All IPC calls follow a consistent pattern:

**Request Format:**
```javascript
window.electronAPI.methodName(data) → Promise<Response>
```

**Response Format:**
```javascript
{
  success: boolean,
  data?: any,        // On success
  error?: string     // On error
}
```

### Example IPC Call Chain

```javascript
// 1. Frontend initiates
const result = await window.electronAPI.generateChallenge({
  communityId: "cardano-devs-ph"
});

// 2. Preload receives and forwards
// preload.js (contextBridge)
window.electronAPI.generateChallenge = (data) =>
  ipcRenderer.invoke('generate-challenge', data);

// 3. Main process handles
// signature-ipc.js
ipcMain.handle('generate-challenge', async (event, data) => {
  const challenge = CardanoSigner.generateChallenge(data.communityId);
  return { success: true, data: challenge };
});

// 4. Response sent back to renderer
// Frontend receives result
if (result.success) {
  displayChallenge(result.data);
}
```

## File Organization

### Core Business Logic (`src/main/`)

| File | Purpose | Dependencies |
|------|---------|--------------|
| `app-config.js` | Configuration management | fs, path |
| `app-logger.js` | Logging system | fs, path |
| `cardano/signer.js` | Signature operations | crypto, uuid |
| `cardano/address-utils.js` | Address validation | logger |
| `cardano/transaction-utils.js` | Transaction utilities | logger |
| `cardano/cip30-sim.js` | CIP-30 wallet simulator | uuid, logger |

### IPC Handlers (`src/main/ipc-handlers/`)

| File | Handles | IPC Events |
|------|---------|------------|
| `signature-ipc.js` | Signatures | generate-challenge, verify-signature, sign-message |
| `wallet-ipc.js` | Wallets | generate-keypair, derive-address, export-wallet |
| `admin-ipc.js` | Admin ops | verify-onchain, get-user-registry, export-report, switch-network |

### Frontend (`src/renderer/`)

| File | Purpose |
|------|---------|
| `index.html` | DOM root |
| `app.js` | Main application logic & routing |
| `styles/app.css` | All styling (unified dark theme) |
| `utils/ui-helpers.js` | UI utility functions |
| `utils/validator.js` | Input validation |

### CLI Tools (`cli/`)

| File | Purpose |
|------|---------|
| `verify.js` | Verify signatures from command line |
| `challenge.js` | Generate challenges from command line |
| `batch-action.js` | Process batch operations |
| `report.js` | Generate various reports |

## Security Model

### Process Isolation

```
┌─────────────────────────────────────────┐
│         Electron Renderer               │
│  (Sandboxed, no Node access)            │
│  ┌───────────────────────────────────┐  │
│  │ Web APIs + electronAPI only       │  │
│  └───────────────────────────────────┘  │
│              ↓ IPC ↑                    │
│         (Serialized data)               │
├─────────────────────────────────────────┤
│   Preload Script (contextBridge)        │
│   (Validates IPC messages)              │
├─────────────────────────────────────────┤
│     Electron Main Process               │
│  (Full Node.js access)                  │
│  ┌───────────────────────────────────┐  │
│  │ IPC Handlers + Core Logic         │  │
│  │ - Input validation                │  │
│  │ - Business logic execution        │  │
│  │ - File system access              │  │
│  │ - External API calls              │  │
│  └───────────────────────────────────┘  │
└─────────────────────────────────────────┘
```

### Security Features

✅ **Context Isolation**: Renderer cannot access Node.js APIs  
✅ **Preload Filtering**: Only approved APIs exposed  
✅ **IPC Validation**: All messages validated  
✅ **No eval()**: No code injection points  
✅ **Local Signing**: Keys never leave device  
✅ **Secure Defaults**: Logs sanitized, no sensitive data  

## State Management

### Application State

```
Application
├─ config (loaded from disk)
│   ├─ network: string
│   ├─ networks: object
│   └─ app: object
│
├─ currentPage: string
│
└─ UI Components
    ├─ Forms (text inputs, etc)
    └─ Results (output displays)
```

### Persistence

- **Config**: `config/app-config.json` (app-config.js manages)
- **Logs**: `logs/app-YYYY-MM-DD.log` (app-logger.js manages)
- **Reports**: `data/reports/report-*.json` (admin-ipc.js creates)
- **User Data**: Application cache (managed by Electron)

## Extension Points

### Adding New IPC Handler

1. Create new file in `src/main/ipc-handlers/`
2. Use `ipcMain.handle()` pattern
3. Export handler registration
4. Import in `electron.js`
5. Expose in `preload.js` contextBridge

### Adding New CLI Tool

1. Create file in `cli/`
2. Parse command-line arguments
3. Use core modules (signer, logger, config)
4. Output results to stdout/file
5. Exit with appropriate code

### Adding New UI Page

1. Add case in `renderPage()` method
2. Create HTML for page
3. Create setup method (`setupPageName()`)
4. Add navigation link in header

## Testing Strategy

### Unit Tests (Planned)

- Signer functions
- Address validation
- CLI argument parsing
- Validators

### Integration Tests (Planned)

- IPC call chains
- Full workflows (sign → verify)
- File operations
- Config management

### Manual Tests

- Application launch
- Navigation between pages
- All button clicks
- Form submissions
- CLI tool execution

---

**Architecture designed for:**
- ✅ Maintainability (clear module boundaries)
- ✅ Security (process isolation, input validation)
- ✅ Scalability (extensible IPC patterns)
- ✅ Testability (pure functions where possible)
- ✅ User experience (responsive UI, clear feedback)
