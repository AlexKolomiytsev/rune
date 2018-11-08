import * as dotenv from 'dotenv';
dotenv.config({ path: `./.env.${process.env.NODE_ENV}` });

export default {
  host: process.env.APP_HOST || 'localhost',
  port: process.env.PORT || 3030,
};
