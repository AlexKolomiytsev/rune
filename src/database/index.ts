import config from '@app/utils/config';
import { Mongo } from '@app/database/mongo';
import { Redis } from '@app/database/redis';

const { MONGO_DB, REDIS } = config.get('/constants/DB_ADAPTERS');

export default class Db {
  private db: Mongo | Redis;

  constructor(dbConnection: string) {
    this.db = Db.connectionInstance[dbConnection];
  }

  public async connect() {
    return this.db.connect();
  }

  private static get connectionInstance(): { [key: string]: Mongo | Redis } {
    return {
      [MONGO_DB]: new Mongo(),
      [REDIS]: new Redis(),
    };
  }
}
