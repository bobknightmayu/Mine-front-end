#!/usr/bin/env node

/**
 * CLI: Verify Signature
 * Usage: node cli/verify.js --pubkey <key> --message <msg> --signature <sig>
 */

const CardanoSigner = require('../src/main/cardano/signer');
const logger = require('../src/main/app-logger');

function printUsage() {
  console.log(`
Usage: node cli/verify.js --pubkey <key> --message <msg> --signature <sig>

Options:
  --pubkey      Public key (hex)
  --message     Message to verify
  --signature   Signature (hex)
  --help        Show this help message

Example:
  node cli/verify.js \\
    --pubkey a0a1a2a3a4a5a6a7 \\
    --message "Hello Cardano" \\
    --signature d0d1d2d3d4d5d6d7
  `);
}

function parseArgs() {
  const args = process.argv.slice(2);
  const parsed = {};

  for (let i = 0; i < args.length; i++) {
    if (args[i].startsWith('--')) {
      const key = args[i].substring(2);
      const value = args[i + 1];
      if (!value || value.startsWith('--')) {
        if (key === 'help') {
          return null;
        }
        throw new Error(`Missing value for ${args[i]}`);
      }
      parsed[key] = value;
      i++;
    }
  }

  return parsed;
}

async function main() {
  try {
    const args = parseArgs();

    if (!args) {
      printUsage();
      process.exit(0);
    }

    const { pubkey, message, signature } = args;

    if (!pubkey || !message || !signature) {
      console.error('Error: Missing required arguments');
      printUsage();
      process.exit(1);
    }

    logger.info('Verifying signature...');
    const isValid = CardanoSigner.verifySignature(pubkey, message, signature);

    if (isValid) {
      console.log('✅ Signature is VALID');
      process.exit(0);
    } else {
      console.log('❌ Signature is INVALID');
      process.exit(1);
    }
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
}

main();
