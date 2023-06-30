const winston = require('winston');

const log = winston.createLogger({
  levels: {
    error: 0,
    warn: 1,
    info: 2,
    debug: 3,
  },
  transports: [
    new winston.transports.Console({
      level: 'debug',
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple(),
        winston.format.printf((msg) => `${msg.level} > ${msg.message.substr(0, 100)}`),
      ),
    }),
    new winston.transports.File({
      filename: './logs/error.log',
      level: 'error',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.simple(),
      ),
    }),
    new winston.transports.File({
      filename: './logs/combined.log',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.simple(),
      ),
    }),
  ],
});

winston.addColors({
  error: 'bold white redBG',
  warn: 'bold white cyanBG',
  info: 'bold white greenBG',
  debug: 'bold white yellowBG',
});

log.info('Логирование событий [ОК]'); 

module.exports = log;