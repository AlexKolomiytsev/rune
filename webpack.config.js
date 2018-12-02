const fs = require('fs');
const { TsConfigPathsPlugin } = require('awesome-typescript-loader');
const TSLintPlugin = require('tslint-webpack-plugin');

var nodeModules = {};
fs.readdirSync('node_modules')
  .filter(function(x) {
    return ['.bin'].indexOf(x) === -1;
  })
  .forEach(function(mod) {
    nodeModules[mod] = 'commonjs ' + mod;
  });

module.exports = {
  entry: {
    index: './src/index.ts',
    tests: './src/tests/index.ts',
    workers: './src/workers/index.ts',
  },
  output: {
    path: __dirname + '/dist',
    filename: '[name].js',
  },
  resolve: {
    // Add '.ts' and '.tsx' as a resolvable extension.
    extensions: ['.ts'],
    plugins: [new TsConfigPathsPlugin()],
  },
  module: {
    rules: [
      /****************
       * PRE-LOADERS
       *****************/
      {
        enforce: 'pre',
        test: /\.js$/,
        use: 'source-map-loader',
      },

      /****************
       * LOADERS
       *****************/
      {
        test: /\.ts$/,
        exclude: [/node_modules/],
        use: 'awesome-typescript-loader',
      },
    ],
  },
  plugins: [
    new TSLintPlugin({
      files: ['./src/**/*.ts'],
      project: 'tsconfig.json',
      config: 'tslint.json',
      format: 'stylish',
    }),
  ],
  target: 'node',
  externals: nodeModules,
  stats: 'errors-only',
  mode: 'development',
};
