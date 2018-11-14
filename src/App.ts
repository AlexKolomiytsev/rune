import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import * as express from 'express';
import * as http from 'http';
import * as morgan from 'morgan';
import * as socketIo from 'socket.io';

import { logger } from '@app/services';
import config from '@app/config';
import api from '@app/api/routes';
import views from '@app/views/routes';
import Db from '@app/database';
import responder from '@app/responder';

// @ts-ignore
express.response = responder;

const { MONGO_DB } = config.get('/constants/DB_ADAPTERS');

class App {
  public app: express.Application;
  public server: http.Server;
  private http: http.Server;
  // @ts-ignore
  private socket: socketIo.Server;
  private port: number;
  private apiPrefix: string;
  private viewsPrefix: string;

  constructor() {
    this.port = config.get('/server/port');
    this.apiPrefix = config.get('/api/prefix');
    this.viewsPrefix = config.get('/views/prefix');

    this.app = express();
    this.http = new http.Server(this.app);
    this.socket = socketIo(this.http);
  }

  public async start(cb?: (err: Error) => void) {
    this.configure();

    try {
      await this.connectDb();
      this.mountRoutes();

      this.server = this.app.listen(this.port, cb);
    } catch (e) {
      logger.error(e);
    }
  }

  private configure() {
    this.app.use(bodyParser.urlencoded({ extended: true }));
    this.app.use(bodyParser.json());
    this.app.use(cors());
    this.app.use(morgan('common'));
    this.app.set('views', './views/pages');
    this.app.set('view engine', 'pug');
  }

  private async connectDb() {
    const mongo = new Db(MONGO_DB);
    return await mongo.connect();
  }

  private mountRoutes(): void {
    this.app.use(`/${this.apiPrefix}`, api);
    this.app.use(`/${this.viewsPrefix}`, views);
  }
}

export default App;
