export default {
  UserDAO: Symbol('UserDAO'),
  Application: Symbol('Application'),

  // Connections
  Mongo: Symbol('Mongo'),
  Redis: Symbol('Redis'),

  // Services
  UserService: Symbol('UserService'),
  Queue: Symbol('Queue'),
  Jwt: Symbol('Jwt'),
  Logger: Symbol('Logger'),

  // Middlewares
  AuthMiddleware: Symbol('AuthMiddleware'),
};
