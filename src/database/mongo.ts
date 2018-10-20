import * as mongoose from 'mongoose';
import * as bluebird from 'bluebird';
import config from '@app/config';

const { MONGO_DB } = config.get('/constants/DB_ADAPTERS');

export class Mongo {
  private static config() {
    const cfg = config.get('/db', { dbConnection: MONGO_DB });
    const { connection, host, port, dbName } = cfg;

    return {
      ...cfg,
      url: `${connection}://${host}:${port}/${dbName}`,
    };
  }

  private mongoose: any;

  constructor() {
    this.mongoose = mongoose;
    this.mongoose.Promise = bluebird;
  }

  public connect() {
    this.mongoose.connect(
      Mongo.config().url,
      { useNewUrlParser: true },
    );
  }
}
