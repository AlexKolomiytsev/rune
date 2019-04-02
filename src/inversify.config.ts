import { Container } from 'inversify';
import { iocTYPES } from '@app/utils/constants';
import Application from '@app/Application';
import UserDAOImpl from '@app/dataAccess/UserDAOImpl';
import UserService from '@app/services/UserService';
import EmailService from '@app/services/EmailService';
import JwtService from '@app/services/JwtService';
import QueueService from '@app/services/QueueService';
import SessionService from '@app/services/SessionService';
import Logger from '@app/services/Logger';
import { Mongo, Redis } from '@app/connections';
import { AuthMiddleware, ValidationMiddleware } from '@app/middlewares';
import EmailNotificationJobProcessor from '@app/workers/processors/EmailNotificationJobProcessor';
import WorkerImpl from '@app/workers/WorkerImpl';
import ProcessorInitializers from '@app/workers/ProcessorInitializers';

import './controllers';

const container = new Container();

// Application
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

// Data Access
container.bind(iocTYPES.UserDAO).to(UserDAOImpl);

// Services
container.bind(iocTYPES.EmailService).to(EmailService);
container.bind(iocTYPES.UserService).to(UserService);
container.bind(iocTYPES.SessionService).to(SessionService);
container.bind(iocTYPES.Jwt).to(JwtService);
container.bind(iocTYPES.Queue).to(QueueService);
container.bind(iocTYPES.Logger).to(Logger);

// Worker
container.bind(iocTYPES.Worker).to(WorkerImpl);
container.bind(iocTYPES.ProcessorInitializers).to(ProcessorInitializers);
container.bind(iocTYPES.EmailNotificationJobProcessor).to(EmailNotificationJobProcessor);

// Middlewares
container.bind(iocTYPES.AuthMiddleware).to(AuthMiddleware);
container.bind(iocTYPES.ValidationMiddleware).to(ValidationMiddleware);

export default container;
