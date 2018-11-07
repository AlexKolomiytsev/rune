import * as dotenv from 'dotenv';
dotenv.config({ path: `./.env.${process.env.NODE_ENV}` });

export const DB_ADAPTERS = {
  REDIS: 'redis',
  MONGO_DB: 'mongodb',
  POSTGRES: 'postgres',
};

const connections = {
  [DB_ADAPTERS.MONGO_DB]: {
    connection: 'mongodb',
    host: process.env.MONGODB_HOST,
    port: process.env.MONGODB_PORT,
    dbName: process.env.MONGODB_DATABASE,
    user: process.env.MONGODB_USER,
    pass: process.env.MONGODB_PASS,
  },
  [DB_ADAPTERS.POSTGRES]: {
    connection: 'postgresql',
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT,
    dbName: process.env.POSTGRES_DATABASE,
    user: process.env.POSTGRES_USER,
    pass: process.env.POSTGRES_PASS,
  },
};

export default {
  $filter: 'dbConnection',
  ...connections,
  $default: connections[DB_ADAPTERS.MONGO_DB],
};
