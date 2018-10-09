var fs = require("fs");
const { TsConfigPathsPlugin } = require('awesome-typescript-loader');

var nodeModules = {};
fs.readdirSync("node_modules")
  .filter(function(x) {
    return [".bin"].indexOf(x) === -1;
  })
  .forEach(function(mod) {
    nodeModules[mod] = "commonjs " + mod;
  });

module.exports = {
  entry: "./src/index.ts",
  output: {
    path: __dirname + "/dist",
    filename: "index.js",
  },
  resolve: {
    // Add '.ts' and '.tsx' as a resolvable extension.
    extensions: [".ts"],
    plugins: [
      new TsConfigPathsPlugin()
    ]
  },
  module: {
    rules: [
      /****************
       * PRE-LOADERS
       *****************/
      {
        enforce: 'pre',
        test: /\.js$/,
        use: 'source-map-loader'
      },

      /****************
       * LOADERS
       *****************/
      {
        test: /\.ts$/,
        exclude: [ /node_modules/ ],
        use: 'awesome-typescript-loader'
      }
    ],
  },
  target: 'node',
  mode: 'development',
  externals: nodeModules,
};
