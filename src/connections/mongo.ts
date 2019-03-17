import { injectable } from 'inversify';
import * as mongoose from 'mongoose';
import * as bluebird from 'bluebird';

import config from '@app/utils/config';
import { IMongo } from '@app/types';

const { MONGO_DB } = config.get('/constants/DB_ADAPTERS');
const cfg = config.get('/db', { dbConnection: MONGO_DB });
const { connection, host, port, user, pass, dbName } = cfg;

@injectable()
export default class Mongo implements IMongo {
  private static config() {
    return {
      ...cfg,
      url: `${connection}://${Mongo.credentials}${host}:${port}/${dbName}`,
    };
  }

  private static get credentials() {
    return user && pass ? `${user}:${pass}@` : '';
  }

  public client: mongoose.Connection;
  private readonly mongoose: any = mongoose;

  constructor() {
    this.mongoose.set('useCreateIndex', true);
    this.mongoose.Promise = bluebird;
  }

  public async connect() {
    const mongooseConnection = await this.mongoose.connect(
      Mongo.config().url,
      { useNewUrlParser: true },
    );
    this.client = mongooseConnection.connection;

    return mongooseConnection;
  }
}
