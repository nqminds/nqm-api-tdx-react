const path = require('path');
const webpack = require('webpack');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'nqm-api-tdx-react.min.js',
    libraryTarget: 'umd',
    library: 'nqm-api-tdx-react',
    // Workaround to fix umd build, restore webpack v3 behaviour
    // https://github.com/webpack/webpack/issues/6677
    // https://github.com/webpack/webpack/issues/6642
    globalObject: "typeof self !== 'undefined' ? self : this"
  },
  module: {
    rules: [
      {
        test: /\.(js)$/,
        use: 'babel-loader'
      }
    ]
  },
  plugins: [
    new UglifyJsPlugin(),
  ],
  externals: {
    lodash: { 
      commonjs: "lodash",
      commonjs2: "lodash",
      amd: "_",
      root: "_",
    },
  },
}
