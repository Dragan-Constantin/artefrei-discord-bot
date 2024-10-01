const winston = require('winston');
const fs = require('fs');
const path = require('path');

// Set logs folder and filename
const LOGS_FOLDER = process.env.LOGS_FOLDER || './logs';
const LOGS_FILENAME = `bot.log`;
const LOGS_FULLPATH = path.join(LOGS_FOLDER, LOGS_FILENAME);

// Ensure the logs directory exists
if (!fs.existsSync(LOGS_FOLDER)) {
  fs.mkdirSync(LOGS_FOLDER, { recursive: true });
}

console.log(`Logging to: ${LOGS_FULLPATH}`);

// Set up logging using winston
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss',
    }),
    winston.format.printf((info) => `${info.timestamp} [${info.level.toUpperCase()}]: ${info.message}`)
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: LOGS_FULLPATH }),
  ],
});

module.exports = logger;
