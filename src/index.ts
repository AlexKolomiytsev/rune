import 'reflect-metadata';
import { InversifyExpressServer } from 'inversify-express-utils';

import { iocTYPES } from '@app/utils/constants';
import { IApplication, IMongo, IRedis } from '@app/types';
import config from '@app/utils/config';

import container from './inversify.config';
import { AuthProvider } from '@app/providers';
import { ILogger } from '@app/services';

const port = config.get('/server/port');
const mode = config.get('/node/mode');

const server = new InversifyExpressServer(
  container,
  null,
  { rootPath: config.get('/api/prefix') },
  null,
  AuthProvider,
);
const application = container.get<IApplication>(iocTYPES.Application);
const logger = container.get<ILogger>(iocTYPES.Logger);
const redis = container.get<IRedis>(iocTYPES.Redis);
const mongo = container.get<IMongo>(iocTYPES.Mongo);

application.start(server, (err: Error) => {
  if (!err) {
    logger.success(`Application is running on ${port} port in ${mode} mode`);
    // Send the ready signal to PM2
    process.send('ready');
  }
});

// Gracefull shutdown
process.on('SIGINT', () => {
  application.server.close((err: Error) => {
    if (err) {
      logger.error(err);
      process.exit(1);
    }
    logger.info('Server connection closed');

    redis.client.quit(() => {
      logger.info('Redis connection closed');
    });

    if (mongo.client.readyState === 1) {
      mongo.client.close(() => {
        logger.info('Mongoose connection closed');
        process.exit(0);
      });
    } else {
      process.exit(0);
    }
  });
});
