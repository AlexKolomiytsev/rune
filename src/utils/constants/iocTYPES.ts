export default {
  Application: Symbol('Application'),

  // Connections
  Mongo: Symbol('Mongo'),
  Redis: Symbol('Redis'),

  // Services
  EmailService: Symbol('EmailService'),
  UserService: Symbol('UserService'),
  SessionService: Symbol('Session'),
  Queue: Symbol('Queue'),
  Jwt: Symbol('Jwt'),
  Logger: Symbol('Logger'),

  // Data Access
  UserDAO: Symbol('UserDAO'),

  // Worker
  Worker: Symbol('Worker'),
  EmailNotificationJobProcessor: Symbol('EmailNotificationJobProcessor'),
  ProcessorInitializers: Symbol('ProcessorInitializers'),

  // Middlewares
  AuthMiddleware: Symbol('AuthMiddleware'),
  ValidationMiddleware: Symbol('ValidationMiddleware'),
};
