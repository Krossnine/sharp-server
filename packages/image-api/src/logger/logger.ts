import pino from 'pino'
import config from '@/config'

const pinoInstance = pino({
    name : config.LOG_NAME,
    level: config.LOG_LEVEL,
    enabled: config.NODE_ENV !== 'test'
});

pinoInstance.info(config, "Loaded configuration");

export default pinoInstance;
