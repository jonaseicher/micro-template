import 'dotenv';
// import { Logtail } from '@logtail/node';
// import { LogtailTransport } from '@logtail/winston';
import colors from 'colors';
import jsonColorize from 'json-colorizer';
import winston, { format } from 'winston';

console.log('log-level root   ', process.env.CONSOLE_LOG_LEVEL_ROOT);

// Create a Logtail client TODO: replace token
// const logtail = new Logtail('your-logtail-source-token');

// async function enrichLogs(log: ILogtailLog): Promise<ILogtailLog> {
//   return {
//     ...log,
//     institutionId: config?.PRAXIS_ID,
//     orgId: config?.PRAXIS_ID,
//     gitBranch: config?.GIT_BRANCH,
//   };
// }
// logtail.use(enrichLogs);

const formatParams = (info: winston.Logform.TransformableInfo) => {
  const { timestamp, level, message, module, ...args } = info;
  const ts = colors.grey(timestamp.slice(11, 23));

  let prettyArgs = '';

  if (process.env.CONSOLE_LOG_ARGS) {
    prettyArgs = Object.keys(args).length ? jsonColorize(JSON.stringify(args, null, 2)) : '';
  }

  const myModule = colors.bold(`\t${module || ''}\t`);

  return `${ts} ${level}:${myModule}${message} ${prettyArgs}`;
};

const myNiceFormat = format.combine(
  format.colorize(),
  format.timestamp(),
  format.printf(formatParams),
);

const defaultLevel = process.env.CONSOLE_LOG_LEVEL_DEFAULT || 'info';

function createLogger(
  module: string,
  consoleLevel: string | undefined,
  logtailLevel: string = 'info',
): winston.Logger {
  return winston.createLogger({
    transports: createTransports(consoleLevel || defaultLevel, logtailLevel),
    defaultMeta: { module },
  });
}

function createTransports(
  consoleLevel: string,
  _logtailLevel: string,
  format: winston.Logform.Format = myNiceFormat,
): winston.transport[] {
  return [
    new winston.transports.Console({
      level: consoleLevel,
      format,
    }),
    // new LogtailTransport(logtail, { level: logtailLevel }), // TODO: enable logtail transport when token is set
  ];
}

// Create a Winston logger - passing in the Logtail transport
export const log = createLogger('root', process.env.CONSOLE_LOG_LEVEL_ROOT);

export default log;

// DEFINE ADDITIONAL LOGGERS HERE:

/** the module is printed in the log output */
export const httpLogger = createLogger('http ', process.env.CONSOLE_LOG_LEVEL_HTTP);
export const diagLogger = createLogger('diag ', process.env.CONSOLE_LOG_LEVEL_DIAG);
export const indexLogger = createLogger('index', process.env.CONSOLE_LOG_LEVEL_INDEX);
export const nedbLogger = createLogger('nedb', process.env.CONSOLE_LOG_LEVEL_NEDB);

console.log('log-level http   ', httpLogger.transports[0].level);
console.log('log-level diag   ', diagLogger.transports[0].level);
console.log('log-level nedb   ', nedbLogger.transports[0].level);
console.log('log-level log    ', log.transports[0].level);
