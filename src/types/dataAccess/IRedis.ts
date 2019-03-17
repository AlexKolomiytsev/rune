import * as redis from 'redis';

export default interface IRedis {
  client: redis.RedisClient;
  connect(): Promise<redis.RedisClient>;
}
