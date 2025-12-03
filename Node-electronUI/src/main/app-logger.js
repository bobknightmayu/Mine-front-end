/**
 * Application Logger
 * Centralized logging with file output
 */

const fs = require('fs');
const path = require('path');

// Create logs directory
const logsDir = path.join(__dirname, '../../logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

const logFile = path.join(logsDir, `app-${new Date().toISOString().split('T')[0]}.log`);

class Logger {
  constructor(context = 'APP') {
    this.context = context;
  }

  /**
   * Format log message
   */
  formatMessage(level, message) {
    const timestamp = new Date().toISOString();
    return `[${timestamp}] [${level}] [${this.context}] ${message}`;
  }

  /**
   * Write to file and console
   */
  write(level, message) {
    const formatted = this.formatMessage(level, message);

    // Console output
    const colorMap = {
      'INFO': '\x1b[36m',    // Cyan
      'WARN': '\x1b[33m',    // Yellow
      'ERROR': '\x1b[31m',   // Red
      'DEBUG': '\x1b[35m',   // Magenta
      'RESET': '\x1b[0m'
    };

    console.log(`${colorMap[level] || ''}${formatted}${colorMap['RESET']}`);

    // File output
    try {
      fs.appendFileSync(logFile, formatted + '\n');
    } catch (err) {
      console.error('Failed to write to log file:', err);
    }
  }

  info(message) {
    this.write('INFO', message);
  }

  warn(message) {
    this.write('WARN', message);
  }

  error(message) {
    this.write('ERROR', message);
  }

  debug(message) {
    this.write('DEBUG', message);
  }
}

module.exports = new Logger('Main');
