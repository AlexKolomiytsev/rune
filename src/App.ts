import * as bodyParser from 'body-parser';
import * as colors from 'colors';
import * as cors from 'cors';
import * as express from 'express';
import * as http from 'http';
import * as morgan from 'morgan';
import * as socketIo from 'socket.io';

import config from '@app/config';
import routes from '@app/routes';
import Db from '@app/database';

const { MONGO_DB } = config.get('/constants/DB_ADAPTERS');

class App {
  public app: any;
  public server: any;
  private http: any;
  // @ts-ignore
  private socket: any;
  private host: string;
  private port: number;
  private mode: string;
  private apiPrefix: string;

  constructor() {
    this.host = config.get('/server/host');
    this.port = config.get('/server/port');
    this.mode = config.get('/node/mode');
    this.apiPrefix = config.get('/api/prefix');

    this.app = express();
    this.http = new http.Server(this.app);
    this.socket = socketIo(this.http);
  }

  public start() {
    this.configure();
    this.connectDb();

    this.mountRoutes();
    // TODO: promisify callback instead of returning a promise
    // tslint:disable-next-line ter-arrow-parens
    return new Promise(resolve => {
      this.server = this.app.listen(this.port, this.host, () => {
        // tslint:disable-next-line no-console
        console.log(
          colors.bgMagenta.black(
            `\nApplication is running at ${this.host}:${this.port} in ${this.mode} mode\n`,
          ),
        );
        resolve();
      });
    });
  }

  private configure() {
    this.app.use(bodyParser.urlencoded({ extended: true }));
    this.app.use(bodyParser.json());
    this.app.use(cors());
    this.app.use(morgan('dev'));
  }

  private connectDb() {
    const mongo = new Db(MONGO_DB);
    mongo.connect();
  }

  private mountRoutes(): void {
    this.app.use(`/${this.apiPrefix}`, routes);
  }
}

export default App;
