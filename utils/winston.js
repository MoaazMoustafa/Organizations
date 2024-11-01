const winston = require('winston');

const { combine, timestamp, json } = winston.format;

const logger = winston.createLogger({
  level: 'info',
  format: combine(
    timestamp({
      format: 'YYYY-MM-DD hh:mm:ss A',
    }),
    json(),
  ),
  defaultMeta: { service: 'user-service' },
  transports: [
    new winston.transports.File({
      filename: './logs/error.log',
      level: 'error',
    }),
    new winston.transports.File({ filename: './logs/combined.log' }),
  ],
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(
    new winston.transports.Console({
      format: winston.format.simple(),
    }),
  );
}

const stream = {
  write: message => {
    logger.info(message.trim());
  },
};

module.exports = { logger, stream };
