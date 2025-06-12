const winston = require('winston');
require('winston-daily-rotate-file'); // Ensure this is installed

// Define log format
const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }), // Capture stack trace
  winston.format.json()
);

// Setup transports
const transports = [
  // Rotating log file for info and up
  new winston.transports.DailyRotateFile({
    filename: 'logs/app-%DATE%.log',
    datePattern: 'YYYY-MM-DD',
    zippedArchive: true,
    maxSize: '20m',
    maxFiles: '14d',
    level: 'info',
    format: logFormat,
  }),

  // Error-specific file
  new winston.transports.File({
    filename: 'logs/errors.log',
    level: 'error',
    format: logFormat,
  }),

  // Warning-specific file
  new winston.transports.File({
    filename: 'logs/warnings.log',
    level: 'warn',
    format: logFormat,
  }),
];

// Console transport only in non-production environments
if (process.env.NODE_ENV !== 'production') {
  transports.push(
    new winston.transports.Console({
      level: 'debug',
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    })
  );
}

// Create logger
const logger = winston.createLogger({
  level: 'info',
  transports,
  exitOnError: false, // Don't exit on handled exceptions
});

// Handle uncaught exceptions and unhandled promise rejections
logger.exceptions.handle(
  new winston.transports.File({ filename: 'logs/exceptions.log' })
);

process.on('unhandledRejection', (ex) => {
  throw ex;
});

module.exports = logger;
