import * as dotenv from 'dotenv';
dotenv.config({ path: `./.env.${process.env.NODE_ENV}` });

const authConfig = {
  development: {
    accessTokenSecret: 'someSecret',
    accessTokenExpiresIn: 60 * 15,
    verificationTokenSecret: 'someVerificationTokenSecret',
    verificationTokenExpiresIn: 60 * 60 * 24 * 7,
  },
  production: {
    accessTokenSecret: process.env.AUTH_ACCESS_TOKEN_SECRET,
    accessTokenExpiresIn: 60 * 15,
    verificationTokenSecret: process.env.AUTH_VERIFICATION_TOKEN_SECRET,
    verificationTokenExpiresIn: 60 * 60 * 24 * 7,
  },
};

export default {
  $filter: 'env',
  ...authConfig,
  $default: authConfig.development,
};
