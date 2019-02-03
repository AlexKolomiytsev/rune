import * as Confidence from 'confidence';
import * as dotenv from 'dotenv';
import { pickBy } from 'lodash';

import constants from './constants';
import api from './api';
import auth from './auth';
import node from './node';
import server from './server';
import db, { DB_ADAPTERS } from './db';
import mailgun from './mailgun';
import views from './views';

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
  mailgun,
  views,
  constants: {
    ...constants,
    DB_ADAPTERS,
  },
};

const store = new Confidence.Store(config);

export default {
  get: (key: string, criteria = {}, { removeFalsy = false } = {}) => {
    const cfg = store.get(key, { ...globalCriteria, ...criteria });

    if (removeFalsy) return pickBy(cfg, v => !!v);

    return cfg;
  },
};
