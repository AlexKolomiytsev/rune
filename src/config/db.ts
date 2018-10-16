import * as dotenv from 'dotenv';
dotenv.config({ path: `./.env.${process.env.NODE_ENV}` });

const mongodb = {
  connection: process.env.MONGODB_CONNECTION,
  host: process.env.MONGODB_HOST,
  port: process.env.MONGODB_PORT,
  dbName: process.env.MONGODB_DATABASE,
  user: process.env.MONGODB_USER,
  pass: process.env.MONGODB_PASS,
};

const postgres = {
  connection: process.env.POSTGRES_CONNECTION,
  host: process.env.POSTGRES_HOST,
  port: process.env.POSTGRES_PORT,
  dbName: process.env.POSTGRES_DATABASE,
  user: process.env.POSTGRES_USER,
  pass: process.env.POSTGRES_PASS,
};

export const connections = {
  mongodb,
  postgres,
};

export const primaryConnection = {
  $filter: 'dbConnection',
  ...connections,
  $default: mongodb,
};
