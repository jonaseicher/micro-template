import { diagLogger as log } from './logger';

type Setting = keyof typeof DEFAULTS;

const DEFAULTS = {
  AXIOS_TIMEOUT: 60000,
  /// LOGGING SETTINGS ///
  // THESE HAVE TO BE SET IN THE ENV FILE, NOT IN THE DEFAULTS

  /** default loglevel */
  CONSOLE_LOG_LEVEL_DEFAULT: 'debug',
  /** loglevel for the generic local console logger */
  CONSOLE_LOG_LEVEL_ROOT: 'debug',
  /** request/response logger (set to debug for full response body and response-time) */
  CONSOLE_LOG_LEVEL_HTTP: 'info',
  /** for the Diagnostics logs (env variables, etc.) */
  CONSOLE_LOG_LEVEL_DIAG: 'info',
  /** loglevel that is sent to logtail */
  LOGTAIL_LOG_LEVEL: 'info',
  /** whether to also log objects to the console as JSON (like logtail does (very verbose)) */
  CONSOLE_LOG_ARGS: true,
};

export let config: typeof DEFAULTS = { ...DEFAULTS };

initConfig();

function initConfig(): void {
  const localConf = getLocalConfig();
  const localTypedConfig = addTypingsToConfig(localConf);

  Object.assign(config, localTypedConfig);

  // log.info(`CONFIG ${JSON.stringify(config)}`);
  log.info('CONFIG', config);
}

/** get process.env variables, which are imported by dotenv package from .env file */
function getLocalConfig() {
  const localEnv = process.env as NodeJS.ProcessEnv;
  const printerEnv = Object.fromEntries(
    Object.entries(localEnv).filter((e) => Object.keys(DEFAULTS).includes(e[0])),
  );

  return printerEnv;
}

/** to add types to the process.env variables (which are all strings) */
function addTypingsToConfig(config: NodeJS.ProcessEnv): typeof DEFAULTS {
  let typedConfig: typeof DEFAULTS = JSON.parse(JSON.stringify(config));
  for (const key in typedConfig) {
    // @ts-expect-error - this is fine, we are checking the type of the default value
    if (typeof DEFAULTS[key] === 'number') {
      // @ts-expect-error - this is fine, we are checking the type of the default value
      typedConfig[key] = getNumberSetting(key as Setting);
      // @ts-expect-error - this is fine, we are checking the type of the default value
    } else if (typeof DEFAULTS[key] === 'boolean') {
      // @ts-expect-error - this is fine, we are checking the type of the default value
      typedConfig[key] = getBooleanSetting(key as Setting);
    } else {
      // @ts-expect-error - this is fine, we are checking the type of the default value
      typedConfig[key] = getStringSetting(key as Setting);
    }
  }
  return typedConfig;
}

function getStringSetting(setting: Setting): string {
  const settingType = typeof DEFAULTS[setting];

  if (settingType !== 'string')
    throw Error(`Tried to get Setting as STRING that is actually ${settingType}`);

  return process.env[setting] || (DEFAULTS[setting] as string);
}

function getNumberSetting(setting: Setting): number {
  const settingType = typeof DEFAULTS[setting];

  if (settingType !== 'number')
    throw Error(`Tried to get Setting as NUMBER that is actually ${settingType}`);
  // if the env is undefined, this will return NaN and go to the default
  return Number(process.env[setting]) || (DEFAULTS[setting] as number);
}

function getBooleanSetting(setting: Setting): boolean {
  const settingType = typeof DEFAULTS[setting];

  if (settingType !== 'boolean')
    throw Error(`Tried to get Setting as BOOLEAN that is actually ${settingType}`);

  const envString = process.env[setting];

  if (envString) {
    const envNumber = Number(envString);

    if (Number.isNaN(envNumber)) {
      if (['yes', 'true', 'ja', 'on', 'enabled'].includes(envString.toLowerCase())) {
        return true; // if value is not a number but some kind of true-sounding string, return true
      }

      return false;
    }

    // if it is a number, just cast it to a boolean (0 = false, everything else is true)
    return Boolean(envNumber);
  }

  // when envString is undefined, return default
  return DEFAULTS[setting] as boolean;
}
