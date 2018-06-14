/* global __dirname, require, module*/
"use strict";

const webpack = require("webpack");
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const path = require("path");
const env  = require("yargs").argv.env; // use --env with webpack 2
const libraryName = "nqm-api-tdx-react";
const plugins = [];
let outputFile;

if (env !== "dev") {
  outputFile = libraryName + ".min.js";
} else {
  outputFile = libraryName + ".js";
}

const config = {
  entry: __dirname + "/src/index.js",
  devtool: "source-map",
  output: {
    path: __dirname + "/lib",
    filename: outputFile,
    library: libraryName,
    libraryTarget: "umd",
    umdNamedDefine: true
  },
  module: {
    rules: [
      {
        test: /(\.jsx|\.js)$/,
        loader: "babel-loader",
        exclude: /(node_modules|bower_components)/,
      },
      {
        test: /(\.jsx|\.js)$/,
        loader: "eslint-loader",
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    modules: [path.resolve("./src")],
    extensions: [".json", ".js"]
  },
  plugins: plugins,
  externals: {
    "@nqminds/nqm-tdx-client": "@nqminds/nqm-tdx-client",
    bluebird: "bluebird",
    "cross-fetch": "cross-fetch",
    react: "react",
    "prop-types": "prop-types",
    debug: "debug",
    "@nqminds/nqm-core-utils": "@nqminds/nqm-core-utils",
    lodash: { 
      commonjs: "lodash",
      commonjs2: "lodash",
      amd: "_",
      root: "_",
    },
  },
};

if (env !== "dev") {
  config.optimization = {
    minimizer: [
      new UglifyJsPlugin({
        cache: true,
        parallel: true,
        uglifyOptions: {
          compress: false,
          ecma: 6,
          mangle: true
        },
        sourceMap: true
      })
    ]
  };
}

module.exports = config;
