#!/usr/bin/env node

/**
 * CLI: Export Report
 * Usage: node cli/report.js --type <type> --format <format>
 */

const fs = require('fs');
const path = require('path');
const logger = require('../src/main/app-logger');

function printUsage() {
  console.log(`
Usage: node cli/report.js --type <type> [--format <format>]

Options:
  --type        Report type: user_registry, signatures, stakes, community
  --format      Output format: csv, json, html (default: json)
  --output      Output file (default: report-<timestamp>.<format>)
  --help        Show this help message

Example:
  node cli/report.js --type user_registry --format csv
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

function generateReport(type) {
  const timestamp = new Date().toISOString();

  switch (type) {
    case 'user_registry':
      return {
        title: 'User Registry Report',
        generated: timestamp,
        data: [
          { id: 1, address: 'addr_test1vp...', stake: 1000000, verified: true },
          { id: 2, address: 'addr_test1vq...', stake: 5000000, verified: true }
        ]
      };
    case 'signatures':
      return {
        title: 'Signature Verification Report',
        generated: timestamp,
        data: [
          { id: 1, timestamp: timestamp, publicKey: 'a0a1...', valid: true },
          { id: 2, timestamp: timestamp, publicKey: 'b0b1...', valid: true }
        ]
      };
    case 'stakes':
      return {
        title: 'Stake Distribution Report',
        generated: timestamp,
        totalStaked: 6000000,
        data: [
          { address: 'addr_test1vp...', stake: 1000000 },
          { address: 'addr_test1vq...', stake: 5000000 }
        ]
      };
    case 'community':
      return {
        title: 'Community Report',
        generated: timestamp,
        members: 2,
        totalStake: 6000000,
        data: []
      };
    default:
      throw new Error(`Unknown report type: ${type}`);
  }
}

function convertToCSV(data) {
  if (!data.data || !Array.isArray(data.data)) {
    return JSON.stringify(data);
  }

  const headers = Object.keys(data.data[0]);
  const rows = [headers.join(',')];

  for (const item of data.data) {
    const values = headers.map(h => String(item[h] || ''));
    rows.push(values.join(','));
  }

  return rows.join('\n');
}

function convertToHTML(data) {
  const json = JSON.stringify(data, null, 2);
  return `
<!DOCTYPE html>
<html>
<head>
  <title>${data.title}</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 20px; background: #f5f5f5; }
    .container { max-width: 1200px; margin: 0 auto; background: white; padding: 20px; border-radius: 8px; }
    h1 { color: #333; }
    .meta { color: #999; font-size: 0.9em; margin-bottom: 20px; }
    table { width: 100%; border-collapse: collapse; }
    th, td { padding: 10px; text-align: left; border-bottom: 1px solid #ddd; }
    th { background: #f9f9f9; font-weight: bold; }
  </style>
</head>
<body>
  <div class="container">
    <h1>${data.title}</h1>
    <div class="meta">Generated: ${data.generated}</div>
    <pre>${json}</pre>
  </div>
</body>
</html>
  `;
}

async function main() {
  try {
    const args = parseArgs();

    if (!args) {
      printUsage();
      process.exit(0);
    }

    const { type, format = 'json', output } = args;

    if (!type) {
      console.error('Error: --type is required');
      printUsage();
      process.exit(1);
    }

    logger.info(`Generating ${type} report in ${format} format`);

    const report = generateReport(type);
    let content = '';

    if (format === 'csv') {
      content = convertToCSV(report);
    } else if (format === 'html') {
      content = convertToHTML(report);
    } else {
      content = JSON.stringify(report, null, 2);
    }

    const fileName = output || `report-${Date.now()}.${format}`;
    fs.writeFileSync(fileName, content);

    console.log(`✅ Report generated: ${fileName}`);
    console.log(`   Type: ${type}`);
    console.log(`   Format: ${format}`);
    console.log(`   Size: ${Buffer.byteLength(content)} bytes`);
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
}

main();
