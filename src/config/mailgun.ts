import * as dotenv from 'dotenv';
dotenv.config({ path: `./.env.${process.env.NODE_ENV}` });

export default {
  api_key: process.env.MAILGUN_API_KEY,
  domain: process.env.MAILGUN_DOMAIN,
};
