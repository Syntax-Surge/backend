const winston = require('winston');

// Create a custom logger
const logger = winston.createLogger({
  level: 'info',  // Default log level
  format: winston.format.combine(
    winston.format.colorize(),  // Add color to logs for better readability in the console
    winston.format.timestamp(),  // Add timestamp for logs
    winston.format.printf(({ timestamp, level, message }) => {
      return `${timestamp} [${level}]: ${message}`;
    })
  ),
  transports: [
    new winston.transports.Console(),  // Log to the console
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),  // Log errors to a file
    new winston.transports.File({ filename: 'logs/combined.log' })  // Log all levels to a file
  ],
});

// Use the logger in the API Gateway
module.exports = logger;