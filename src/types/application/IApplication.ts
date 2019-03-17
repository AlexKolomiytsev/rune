import * as express from 'express';
import * as http from 'http';
import { InversifyExpressServer } from 'inversify-express-utils';

export default interface IApplication {
  server: http.Server;
  app: express.Application;
  port: number;
  configure(server: InversifyExpressServer): void;
  start(server: InversifyExpressServer, cb?: (err: Error) => void): void;
}
