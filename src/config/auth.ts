import * as dotenv from 'dotenv';
dotenv.config({ path: `./.env.${process.env.NODE_ENV}` });

const authConfig = {
  development: {
    accessTokenSecret: 'someSecret',
    accessTokenExpiresIn: '1h',
    verificationTokenSecret: 'someVerificationTokenSecret',
    verificationTokenExpiresIn: '7d',
  },
  production: {
    accessTokenSecret: process.env.AUTH_ACCESS_TOKEN_SECRET,
    accessTokenExpiresIn: '15m',
    verificationTokenSecret: process.env.AUTH_VERIFICATION_TOKEN_SECRET,
    verificationTokenExpiresIn: '7d',
  },
};

export default {
  $filter: 'env',
  ...authConfig,
  $default: authConfig.development,
};
