import * as dotenv from 'dotenv';
dotenv.load();

export default {
  host: process.env.APP_HOST,
  port: process.env.APP_PORT,
};
