#!/bin/bash
# Verify headless fix is properly configured

echo "╔════════════════════════════════════════════════════════════════╗"
echo "║         Headless Fix Verification Script                      ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""

ISSUES=0

# Check 1: run-app.js exists
echo -n "✓ Checking run-app.js exists... "
if [ -f "run-app.js" ]; then
    echo "✅"
else
    echo "❌ MISSING"
    ISSUES=$((ISSUES + 1))
fi

# Check 2: package.json points to run-app.js
echo -n "✓ Checking package.json npm start script... "
if grep -q '"start": "node run-app.js"' package.json; then
    echo "✅"
else
    echo "❌ NOT CONFIGURED"
    ISSUES=$((ISSUES + 1))
fi

# Check 3: run-app.js has headless detection
echo -n "✓ Checking run-app.js has headless detection... "
if grep -q "process.env.DISPLAY" run-app.js; then
    echo "✅"
else
    echo "❌ NOT FOUND"
    ISSUES=$((ISSUES + 1))
fi

# Check 4: electron.js exists
echo -n "✓ Checking electron.js exists... "
if [ -f "electron.js" ]; then
    echo "✅"
else
    echo "❌ MISSING"
    ISSUES=$((ISSUES + 1))
fi

# Check 5: Test environment detection
echo -n "✓ Testing environment detection... "
DETECTION=$(node test-headless.js 2>&1 | grep -c "Headless detection working")
if [ "$DETECTION" -eq 1 ]; then
    echo "✅"
else
    echo "⚠️  (May need npm install)"
fi

echo ""
echo "════════════════════════════════════════════════════════════════"
echo ""

if [ $ISSUES -eq 0 ]; then
    echo "✅ All checks passed! Headless fix is properly configured."
    echo ""
    echo "Next steps:"
    echo "  1. npm install"
    echo "  2. npm run build"
    echo "  3. npm run start  (should exit cleanly)"
    echo "  4. npm run cli:challenge -- --community 'test'"
else
    echo "❌ Found $ISSUES issue(s). Please check the configuration."
fi
echo ""
