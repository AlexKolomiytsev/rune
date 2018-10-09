import * as dotenv from 'dotenv';
dotenv.load();

export default {
  mode: {
    $filter: 'env',
    development: 'development',
    production: 'production',
    $default: 'development',
  },
};
