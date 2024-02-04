import {
    createLogger,
    format,
    transports
} from 'winston';

const logTransports = [
    new transports.Console({
        level: 'debug',
        format: format.prettyPrint()
    }),
    new transports.Console({
        level: 'info',
        format: format.prettyPrint()
    }),
    new transports.Console({
        level: 'error',
        format: format.prettyPrint()
    }),
];

export const logger = createLogger({
    format: format.combine(
        format.timestamp()
    ),
    transports: logTransports,
    defaultMeta: { service: 'api' }
});