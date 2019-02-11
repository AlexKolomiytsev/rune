import * as redis from 'redis';
import * as bluebird from 'bluebird';

import config from '@app/utils/config';

const { REDIS } = config.get('/constants/DB_ADAPTERS');
const cfg = config.get('/db', { dbConnection: REDIS }, { removeFalsy: true });

export class Redis {
  public client: redis.RedisClient;
  private redis: any;

  constructor() {
    this.redis = redis;
    bluebird.promisifyAll(this.redis);
  }

  public connect() {
    return this.redis.createClient(cfg);
  }
}
