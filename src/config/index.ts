import * as Confidence from 'confidence';

import node from './node';
import server from './server';
import { primaryConnection, connections } from './db';

const globalCriteria = {
  env: process.env.NODE_ENV,
};

const config = {
  node,
  server,
  db: { primaryConnection, connections },
};

const store = new Confidence.Store(config);

export default {
  get: (key: string, criteria = {}) => store.get(key, { ...globalCriteria, ...criteria }),
};
