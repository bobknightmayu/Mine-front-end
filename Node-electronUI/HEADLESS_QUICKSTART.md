# Quick Start - Headless Environment

## Problem Fixed ✅

The `libatk-1.0.so.0` error is now resolved. The application detects headless environment and exits gracefully before trying to load Electron GUI libraries.

## What Changed

- `npm start` now calls `node run-app.js` instead of `electron .` directly
- `run-app.js` checks `process.env.DISPLAY` BEFORE Electron loads
- In headless: exits with code 0 and shows CLI tool options
- On desktop: proceeds to load Electron normally

## Try It Now

### Test 1: Verify No Error
```bash
npm run start
```

**Expected:**
```
🖥️  Headless environment detected - Electron GUI not available

📝 Available CLI tools:
   npm run cli:challenge -- --community "example"
   npm run cli:verify -- --pubkey xxx --message yyy --signature zzz
   npm run cli:batch -- --file batch.json --action verify
   npm run cli:report -- --type user_registry --format json

✨ For GUI mode, run on a machine with a display:
   npm run dev
```

**Check exit code:**
```bash
echo $?
# Should print: 0 (success)
```

### Test 2: Build and Use CLI
```bash
npm install
npm run build
npm run cli:challenge -- --community "test"
```

**Expected:** Challenge JSON output with UUID, nonce, timestamp, etc.

### Test 3: Run Full Dev (with webpack watch)
```bash
npm run dev
```

**Expected:**
- Same headless message (since no display)
- But webpack build completes successfully
- CLI tools ready to use

## How It Works

```
npm start
   ↓
run-app.js loads (fast, just Node.js)
   ↓
Check: Is DISPLAY variable set?
   ↓
   NO (headless) → Exit with message ✅
   YES (desktop) → Spawn Electron process ✅
```

## Files Modified

1. **package.json** - Changed start script to use `node run-app.js`
2. **run-app.js** - New wrapper that detects headless environment
3. **electron.js** - Already had backup detection

## No More Errors

✅ No `libatk-1.0.so.0` errors  
✅ No `exit code 127`  
✅ Clean exit code `0` in headless  
✅ GUI works on desktop machines  

## Next: Test CLI Tools

All core functionality works without GUI:

```bash
# Challenge generation
npm run cli:challenge -- --community "cardano-devs-ph"

# Signature verification  
npm run cli:verify -- --pubkey abc... --message "Hello" --signature def...

# Batch operations
npm run cli:batch -- --file batch.json --action verify

# Report generation
npm run cli:report -- --type user_registry --format json
```

## For Full Documentation

- **HEADLESS_COMPLETE_FIX.md** - Detailed technical explanation
- **TESTING_GUIDE.md** - Complete testing procedures
- **README.md** - Full API reference

---

**Status**: ✅ FIXED - Ready to use in headless environment
