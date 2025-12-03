#!/usr/bin/env node

/**
 * CLI: Generate Challenge
 * Usage: node cli/challenge.js --community <id> --action <action>
 */

const CardanoSigner = require('../src/main/cardano/signer');
const logger = require('../src/main/app-logger');

function printUsage() {
  console.log(`
Usage: node cli/challenge.js --community <id> [--action <action>]

Options:
  --community   Community ID
  --action      Action type (default: verify_membership)
                Available: verify_membership, authorize_action, sign_document
  --help        Show this help message

Example:
  node cli/challenge.js --community "cardano-devs-ph"
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

    const { community, action } = args;

    if (!community) {
      console.error('Error: Community ID is required');
      printUsage();
      process.exit(1);
    }

    logger.info(`Generating challenge for community: ${community}`);
    const challenge = CardanoSigner.generateChallenge(community, action || 'verify_membership');

    console.log('\n✅ Challenge Generated:\n');
    console.log(JSON.stringify(challenge, null, 2));
    console.log('\n');
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
}

main();
