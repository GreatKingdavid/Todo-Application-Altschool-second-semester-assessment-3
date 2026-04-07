const winston = require('winston');

const logger = winston.createLogger({
  level: 'info', // Only log 'info' and above (warn, error)
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json() // Standard for Cloud/AI tools
  ),
  transports: [
    // Save errors to a file
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    // Save everything to a combined file
    new winston.transports.File({ filename: 'combined.log' }),
  ],
});

// If we're not in production, also log to the console with colors!
if (process.env.NODE_NODE !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple(),
  }));
}

module.exports = logger;