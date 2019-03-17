import { Container } from 'inversify';
import { iocTYPES } from '@app/utils/constants';
import Application from '@app/Application';
import UserDAOImpl from '@app/dataAccess/UserDAOImpl';
import UserService from '@app/services/UserService';
import JwtService from '@app/services/JwtService';
import Logger from '@app/services/Logger';
import { Mongo, Redis } from '@app/connections';

import './controllers';
import QueueService from '@app/services/QueueService';
import { AuthMiddleware } from '@app/middlewares';

const container = new Container();

container.bind(iocTYPES.Application).to(Application);

// Connections
container
  .bind(iocTYPES.Mongo)
  .to(Mongo)
  .inSingletonScope();
container
  .bind(iocTYPES.Redis)
  .to(Redis)
  .inSingletonScope();

// Implementations
container.bind(iocTYPES.UserDAO).to(UserDAOImpl);

// Services
container.bind(iocTYPES.UserService).to(UserService);
container.bind(iocTYPES.Jwt).to(JwtService);
container.bind(iocTYPES.Queue).to(QueueService);
container.bind(iocTYPES.Logger).to(Logger);

// Middlewares
container.bind(iocTYPES.AuthMiddleware).to(AuthMiddleware);

export default container;
