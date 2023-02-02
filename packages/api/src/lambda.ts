import serverlessExpress from '@vendia/serverless-express';
import config from '@/config';
import {createApp} from './app';

const app = createApp(config);

exports.handler = serverlessExpress({ app })
