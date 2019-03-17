import * as express from 'express';
import * as morgan from 'morgan';
import * as cors from 'cors';
import * as bodyParser from 'body-parser';
import * as http from 'http';
import { injectable, inject } from 'inversify';
import { InversifyExpressServer } from 'inversify-express-utils';

import { iocTYPES } from '@app/utils/constants';
import { IApplication, IMongo, IRedis } from '@app/types';
import { responder } from '@app/middlewares';
import config from '@app/utils/config';
import { ILogger } from '@app/services';

@injectable()
export default class Application implements IApplication {
  public server: http.Server;
  public app: express.Application;
  public port: number = config.get('/server/port');

  @inject(iocTYPES.Logger)
  private readonly _logger: ILogger;
  @inject(iocTYPES.Mongo)
  private readonly _mongo: IMongo;
  @inject(iocTYPES.Redis)
  private readonly _redis: IRedis;

  public configure(server: InversifyExpressServer) {
    server.setConfig(app => {
      app.use(responder);
      app.use(bodyParser.urlencoded({ extended: true }));
      app.use(bodyParser.json());
      app.use(cors());
      app.use(morgan('common'));
      app.set('views', './views/pages');
      app.set('view engine', 'pug');
    });

    this.app = server.build();
  }

  public makeConnections() {
    return Promise.all([this._mongo.connect(), this._redis.connect()]);
  }

  public async start(server: InversifyExpressServer, cb?: (err: Error) => void) {
    try {
      this.configure(server);
      await this.makeConnections();

      this.server = this.app.listen(this.port, cb);
    } catch (e) {
      this._logger.error(e);
    }
  }
}
