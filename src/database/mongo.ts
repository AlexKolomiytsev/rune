import * as mongoose from 'mongoose';
import * as bluebird from 'bluebird';
import config from '@app/config';

const { MONGO_DB } = config.get('/constants/DB_ADAPTERS');
const cfg = config.get('/db', { dbConnection: MONGO_DB });
const { connection, host, port, user, pass, dbName } = cfg;

export class Mongo {
  private static config() {
    return {
      ...cfg,
      url: `${connection}://${Mongo.credentials}${host}:${port}/${dbName}`,
    };
  }

  private static get credentials() {
    return user && pass ? `${user}:${pass}@` : '';
  }

  private mongoose: any;

  constructor() {
    this.mongoose = mongoose;
    this.mongoose.set('useCreateIndex', true);
    this.mongoose.Promise = bluebird;
  }

  public async connect() {
    try {
      await this.mongoose.connect(
        Mongo.config().url,
        { useNewUrlParser: true },
      );
    } catch (e) {
      console.log(e);
    }
  }
}
