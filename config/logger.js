import { createLogger, format, transports } from 'winston';
import path from 'path';
import moment from 'moment';

const { combine, timestamp, colorize, printf } = format;

const options = {
  file: {
    handleExceptions: true,
    json: true,
    maxsize: 5242880, // 5MB
    maxFiles: 5,
    colorize: false,
  },
  console: {
    level: 'error',
    handleExceptions: true,
    json: false,
    colorize: true,
  }
}

const logger = createLogger({
  format: combine(
    timestamp({
      format: 'YYYY-MM-DD HH:mm:ss',
    }),
    colorize(),
    printf(info => {
      return `${info.timestamp} ${info.level}: ${info.message}`;
  })),
  transports: [
    new transports.Console(options.console),
    new transports.File(Object.assign(options.file,  { filename: 'logs/stderr.log', level: 'error' })),
    new transports.File(Object.assign(options.file,  { filename: 'logs/stdout.log', level: 'info' })),
  ],
  exitOnError: false,
});

logger.stream = {
  write: function(message, encoding) {
    // use the 'info' log level so the output will be picked up by both transports (file and console)
    logger.info(message);
  },
};

export default logger;
