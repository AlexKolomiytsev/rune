import * as Confidence from 'confidence';
import * as dotenv from 'dotenv';

import constants from './constants';
import api from './api';
import auth from './auth';
import node from './node';
import server from './server';
import db, { DB_ADAPTERS } from './db';

dotenv.config({ path: `./.env.${process.env.NODE_ENV}` });

const globalCriteria = {
  env: process.env.NODE_ENV,
  dbConnection: process.env.PRIMARY_DB_CONNECTION,
};

const config = {
  api,
  auth,
  node,
  server,
  db,
  constants: {
    ...constants,
    DB_ADAPTERS,
  },
};

const store = new Confidence.Store(config);

export default {
  get: (key: string, criteria = {}) => store.get(key, { ...globalCriteria, ...criteria }),
};
