import logger from '@/logger'
import config from '@/config';
import {createApp} from './app';

const app = createApp(config);

app.listen(config.PORT, () => {
    logger.info(`Server listening on port ${config.PORT}`)
});
