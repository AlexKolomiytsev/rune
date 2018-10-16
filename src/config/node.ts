export default {
  mode: {
    $filter: 'env',
    development: 'development',
    production: 'production',
    $default: 'development',
  },
};
