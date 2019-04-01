import { inject, injectable } from 'inversify';
import { iocTYPES } from '@app/utils/constants';
import { IRedis } from '@app/types';
import config from '@app/utils/config';

const accessTokenExpiresIn = config.get('/auth/accessTokenExpiresIn');

export interface ISessionService {
  addToBlacklisted(userId: string, token: string): any;
  getIsBlacklisted(userId: string, token: string): Promise<boolean>;
}

@injectable()
export default class SessionService implements ISessionService {
  private readonly _blacklistKey = 'rune:blacklisted';
  @inject(iocTYPES.Redis)
  private readonly _redis: IRedis;

  public addToBlacklisted(userId: string, token: string): any {
    const key = this.getBlacklistKey(userId);
    const now = Date.now();
    const multi = this._redis.client.multi();
    const removeBefore = now - accessTokenExpiresIn * 1000;

    // delete expired keys
    multi.zremrangebyscore(key, '-inf', removeBefore);
    // ordered set with score set to timestamp
    multi.zadd(key, now, token);
    // use long expiration time (in seconds) on the set itself to eventually purge unused sets.
    multi.expire(key, accessTokenExpiresIn * 10);

    return multi.exec();
  }

  public async getIsBlacklisted(userId: string, token: string): Promise<boolean> {
    const key = this.getBlacklistKey(userId);
    // @ts-ignore
    const tokens = await this._redis.client.zrangeAsync(key, 0, -1);

    return tokens.some((storedToken: string) => storedToken === token);
  }

  private getBlacklistKey(id: string) {
    return `${this._blacklistKey}:${id}`;
  }
}
