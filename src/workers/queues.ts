import * as Queue from 'bull';
import config from '@app/config';

const { REDIS } = config.get('/constants/DB_ADAPTERS');
const redisConfig = config.get('/db', { dbConnection: REDIS });

export const EMAIL_NOTIFICATION = 'EMAIL_NOTIFICATION';

export default {
  [EMAIL_NOTIFICATION]: new Queue(EMAIL_NOTIFICATION, { redis: redisConfig }),
};
