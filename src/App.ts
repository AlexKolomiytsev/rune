import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import * as express from 'express';
import * as http from 'http';
import * as morgan from 'morgan';
import * as socketIo from 'socket.io';

import routes from './routes';

class App {
  public app;
  private http;
  // @ts-ignore
  private socket;

  constructor() {
    this.app = express();
    this.http = new http.Server(this.app);
    this.socket = socketIo(this.http);
  }

  public start() {
    this.configure();
    this.mountRoutes();

    this.app.listen(8080, '127.0.0.1', () => {
      console.log('Listening 8080');
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
