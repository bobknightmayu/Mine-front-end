#!/usr/bin/env node

/**
 * CLI: Batch Action Tool
 * Usage: node cli/batch-action.js --file <file> --action <action>
 */

const fs = require('fs');
const path = require('path');
const CardanoSigner = require('../src/main/cardano/signer');
const logger = require('../src/main/app-logger');

function printUsage() {
  console.log(`
Usage: node cli/batch-action.js --file <file> --action <action>

Options:
  --file        Input JSON file with batch data
  --action      Action to perform (verify, sign, export)
  --output      Output file (default: batch-result-<timestamp>.json)
  --help        Show this help message

Example Input File (batch-verify.json):
{
  "items": [
    {
      "publicKey": "a0a1a2a3...",
      "message": "Hello",
      "signature": "d0d1d2d3..."
    }
  ]
}

Example:
  node cli/batch-action.js --file batch-verify.json --action verify
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

async function processBatch(items, action) {
  const results = [];

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    let result = { index: i, input: item, status: 'success' };

    try {
      if (action === 'verify') {
        const isValid = CardanoSigner.verifySignature(
          item.publicKey,
          item.message,
          item.signature
        );
        result.output = { valid: isValid };
      } else if (action === 'sign') {
        result.output = CardanoSigner.createSignatureObject(
          item.challengeId,
          item.walletAddress,
          item.publicKey
        );
      } else {
        result.status = 'error';
        result.error = `Unknown action: ${action}`;
      }
    } catch (err) {
      result.status = 'error';
      result.error = err.message;
    }

    results.push(result);
    process.stdout.write(`\rProcessing: ${i + 1}/${items.length}`);
  }

  console.log('\n');
  return results;
}

async function main() {
  try {
    const args = parseArgs();

    if (!args) {
      printUsage();
      process.exit(0);
    }

    const { file, action, output } = args;

    if (!file || !action) {
      console.error('Error: --file and --action are required');
      printUsage();
      process.exit(1);
    }

    if (!fs.existsSync(file)) {
      console.error(`Error: File not found: ${file}`);
      process.exit(1);
    }

    logger.info(`Processing batch file: ${file} with action: ${action}`);

    const data = JSON.parse(fs.readFileSync(file, 'utf8'));
    const results = await processBatch(data.items, action);

    const summary = {
      timestamp: new Date().toISOString(),
      action: action,
      inputFile: file,
      totalProcessed: results.length,
      successful: results.filter(r => r.status === 'success').length,
      failed: results.filter(r => r.status === 'error').length,
      results: results
    };

    const outputFile = output || `batch-result-${Date.now()}.json`;
    fs.writeFileSync(outputFile, JSON.stringify(summary, null, 2));

    console.log(`✅ Batch processing complete!`);
    console.log(`   Processed: ${summary.totalProcessed}`);
    console.log(`   Successful: ${summary.successful}`);
    console.log(`   Failed: ${summary.failed}`);
    console.log(`   Results saved to: ${outputFile}`);
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
}

main();
