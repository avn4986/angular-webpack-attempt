const config = require("../build-config");
const express = require("express");
const favicon = require('express-favicon');
const compression = require('compression');
const currentEnvironment = process.env.NODE_ENV || 'development';
const staticPath = currentEnvironment === 'production' ? `${__dirname}/../static` : `${__dirname}/../src/static`;
const port = process.env.PORT || config.dev.port;
const app = express();

app.use(compression());
app.use(favicon(__dirname + '/../favicon.ico'));
app.use('/static', express.static(staticPath));
app.set('view engine', 'ejs');

if (currentEnvironment === 'production') {
  const engine = require('consolidate');
  app.engine('html', engine.mustache);
  app.set('views', __dirname);
  app.get('*.*', express.static(__dirname));
  app.use('/', (req, res) => {
    res.render('index.html', {title: 'ejs'});
  });
} else {
  const webpack = require("webpack");
  const webpackConfig = currentEnvironment === 'production' ? require(`${__dirname}/webpack.prod`) : require(`${__dirname}/webpack.dev`);
  const compiler = webpack(webpackConfig);
  const devMiddleware = require("webpack-dev-middleware")(compiler, {
    publicPath: webpackConfig.output.publicPath,
    quiet: true
  });
  const hotMiddleware = require("webpack-hot-middleware")(compiler, {
    heartbeat: 2000
  });
  app.use(devMiddleware);
  app.use(hotMiddleware);
  app.use(require('connect-history-api-fallback')())
}

/***
 * Regardless of the environment the application server
 * should start.
 * @type {http.Server}
 */
module.exports = app.listen(port, function (err) {
  if (err) {
    console.log(err);
    return
  }
  console.log(`Environment: ${currentEnvironment} Listening on: http://localhost:${port}`)
});