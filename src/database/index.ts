import config from '@app/config';
import { Mongo } from '@app/database/mongo';

const { MONGO_DB } = config.get('/constants/DB_ADAPTERS');

export default class Db {
  private db: Mongo;

  constructor(dbConnection: string) {
    this.db = Db.connectionInstance[dbConnection];
  }

  public async connect() {
    return this.db.connect();
  }

  private static get connectionInstance(): { [key: string]: Mongo } {
    return {
      [MONGO_DB]: new Mongo(),
    };
  }
}
