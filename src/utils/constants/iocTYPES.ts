export default {
  UserDAO: Symbol('UserDAO'),
  Application: Symbol('Application'),

  // Connections
  Mongo: Symbol('Mongo'),
  Redis: Symbol('Redis'),

  // Services
  EmailService: Symbol('EmailService'),
  UserService: Symbol('UserService'),
  Queue: Symbol('Queue'),
  Jwt: Symbol('Jwt'),
  Logger: Symbol('Logger'),

  // Worker
  Worker: Symbol('Worker'),
  EmailNotificationJobProcessor: Symbol('EmailNotificationJobProcessor'),
  ProcessorInitializers: Symbol('ProcessorInitializers'),

  // Middlewares
  AuthMiddleware: Symbol('AuthMiddleware'),
};
