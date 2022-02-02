const winston = require('winston');

const log = winston.createLogger({
    level: 'info',
    format: winston.format.cli(),
    transports: [
        new winston.transports.Console(),
    ],
    exitOnError: false,
});

const info = (message) => log.info(message);
const debug = (message) => log.debug(message);
const error = (message) => log.error(message);
const warn = (message) => log.warn(message);

const updateLevel = function (level) {
    log.level = level;
}

module.exports = {
    debug,
    info,
    warn,
    error,
    updateLevel,
}