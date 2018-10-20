import * as dotenv from 'dotenv';
dotenv.config({ path: `./.env.${process.env.NODE_ENV}` });

const authConfig = {
  development: {
    jwtSecret: 'someSecret',
    jwtExpiresIn: '1h',
  },
  production: {
    jwtSecret: process.env.AUTH_JWT_SECRET,
    jwtExpiresIn: '15m',
  },
};

export default {
  $filter: 'env',
  ...authConfig,
  $default: authConfig.development,
};
