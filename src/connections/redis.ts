import { injectable } from 'inversify';
import * as redis from 'redis';
import * as bluebird from 'bluebird';

import config from '@app/utils/config';
import IRedis from '@app/types/dataAccess/IRedis';

const { REDIS } = config.get('/constants/DB_ADAPTERS');
const cfg = config.get('/db', { dbConnection: REDIS }, { removeFalsy: true });

@injectable()
export default class Redis implements IRedis {
  public client: redis.RedisClient;
  private readonly redis: any = redis;

  constructor() {
    bluebird.promisifyAll(this.redis);
  }

  public async connect() {
    if (!this.client) {
      this.client = await this.redis.createClient(cfg);
    }

    return this.client;
  }
}
