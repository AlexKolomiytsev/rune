import * as bodyParser from 'body-parser';
import * as colors from 'colors';
import * as cors from 'cors';
import * as express from 'express';
import * as http from 'http';
import * as morgan from 'morgan';
import * as socketIo from 'socket.io';

import config from '@app/config';
import routes from '@app/routes';

class App {
  public app: any;
  private http: any;
  // @ts-ignore
  private socket;
  private host: string;
  private port: number;
  private mode: string;

  constructor() {
    this.host = config.get('/server/host');
    this.port = config.get('/server/port');
    this.mode = config.get('/node/mode');

    this.app = express();
    this.http = new http.Server(this.app);
    this.socket = socketIo(this.http);
  }

  public start() {
    this.configure();
    this.mountRoutes();

    this.app.listen(this.port, this.host, () => {
      console.log(colors.bgMagenta.black(
        `\nApplication is running at ${this.host}:${this.port} in ${this.mode} mode\n`
      ));
    });
  }

  private configure() {
    // use body-parser so we can grab information from POST requests
    this.app.use(bodyParser.urlencoded({ extended: true }));
    this.app.use(bodyParser.json());

    // configure our app to handle CORS requests
    this.app.use(
      cors(),
    );

    // log all requests to the console
    this.app.use(morgan('dev'));
  }

  private mountRoutes(): void {
    this.app.use(routes);
  }
}

export default App;
