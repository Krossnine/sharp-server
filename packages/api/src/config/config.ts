import dotenv from 'dotenv-defaults';
import dotenvExpand from 'dotenv-expand';
import dotenvParseVariables, {Parsed} from 'dotenv-parse-variables';

export enum LogLevel {
    DEBUG = 'debug',
    INFO = 'info',
    WARN = 'warn',
    ERROR = 'error'
}

export enum CacheEngine {
    NONE = 'none',
    FILESYSTEM = 'filesystem',
}

export type IConfig = {
    NODE_ENV: string;
    PORT: number;
    LOG_NAME: string;
    LOG_LEVEL: LogLevel;
    CACHE_ENGINE : CacheEngine;
    CACHE_FILESYSTEM_PATH: string | undefined;
    ALLOWED_URL_PATTERNS: Array<string>;
}

function checkLogLevel(config : IConfig) {
    if (!Object.values(LogLevel).includes(config.LOG_LEVEL)) {
        throw new Error(`Invalid log level : ${config.LOG_LEVEL}`);
    }
}

function checkCacheEngine(config: IConfig) {
    if (config.CACHE_ENGINE && !Object.values(CacheEngine).includes(config.CACHE_ENGINE)) {
        throw new Error(`Invalid cache engine : ${config.CACHE_ENGINE}`);
    }
}

function checkCacheConfig(config: IConfig) {
    if (config.CACHE_FILESYSTEM_PATH === '') {
        config.CACHE_FILESYSTEM_PATH = undefined;
    }
}

function checkPort(config: IConfig) {
    if (config.PORT<1 || config.PORT > 65535) {
        throw new Error(`Invalid port : ${config.PORT}`);
    }
}

function checkAuthorization(config: IConfig) {
    // @ts-ignore
    if (config.ALLOWED_URL_PATTERNS === '') {
        config.ALLOWED_URL_PATTERNS = [];
    }
}

function ensureConfig(config: IConfig) {
    checkPort(config);
    checkLogLevel(config);
    checkCacheEngine(config);
    checkCacheConfig(config);
    checkAuthorization(config);
    return config;
}

export function getConfig() {
    const defaultConfigFile = `${__dirname}/.env.defaults`;
    let config = dotenv.config({
        path: `${__dirname}/.env`,
        encoding: 'utf8',
        defaults: defaultConfigFile,
    });
    dotenvExpand.expand(config);
    return ensureConfig(dotenvParseVariables(config.parsed as Parsed) as IConfig);
}

export default getConfig();
