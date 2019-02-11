import 'reflect-metadata';
import App from './App';

import config from '@app/utils/config';
import { logger } from '@app/services';

const port = config.get('/server/port');
const mode = config.get('/node/mode');

const app = new App();

app.start((err: Error) => {
  if (!err) {
    logger.success(`Application is running on ${port} port in ${mode} mode`);
    process.send('ready');
  }
});

// Gracefull shutdown
process.on('SIGINT', () => {
  app.server.close((err: Error) => {
    if (err) {
      logger.error(err);
      process.exit(1);
    }
    logger.info('Server connection closed');

    app.connections.redis.quit(() => {
      logger.info('Redis connection closed');
    });

    if (app.connections.mongo.connection.readyState === 1) {
      app.connections.mongo.connection.close(() => {
        logger.info('Mongoose connection closed');
        process.exit(0);
      });
    } else {
      process.exit(0);
    }
  });
});
