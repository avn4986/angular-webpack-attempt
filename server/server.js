const config = require("../build-config");
const path = require("path");
const express = require("express");
const webpack = require("webpack");
const webpackConfig = process.env.NODE_ENV === 'production'
    ? require('../build/webpack.prod')
    : require('../build/webpack.dev');

// default port where dev server listens for incoming traffic
const port = process.env.PORT || config.dev.port;

// create the express app
const app = express();

// insert the config for webpack
const compiler = webpack(webpackConfig);

// configure the webpack-dev-middleware
const devMiddleware = require("webpack-dev-middleware")(compiler, {
  publicPath: webpackConfig.output.publicPath,
  quiet: true
});

// enable the hot middleware
const hotMiddleware = require("webpack-hot-middleware")(compiler, {
  heartbeat: 2000
});

// serve webpack bundle output
app.use(devMiddleware);

// enable hot-reload and state-preserving
// compilation error display
app.use(hotMiddleware);

// make app listen on specified port
module.exports = app.listen(port, function (err) {
  if (err) {
    console.log(err);
    return
  }

  console.log(`Environment: ${process.env.NODE_ENV} Listening on: http://localhost:${port}`)
});