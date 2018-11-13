import 'reflect-metadata';
import App from './App';

import config from '@app/config';
import { logger } from '@app/services';

const port = config.get('/server/port');
const mode = config.get('/node/mode');

const app = new App();

app.start((err: Error) => {
  if (!err) {
    logger.success(`Application is running on ${port} port in ${mode} mode`);
  }
});
