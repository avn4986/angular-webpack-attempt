const express = require("express");
const favicon = require('express-favicon');
const proxy = require('express-http-proxy');
const compression = require('compression');
const currentEnvironment = process.env.NODE_ENV || 'development';
const staticPath = currentEnvironment === 'production' ? `${__dirname}/static` : `${__dirname}/../src/static`;
const port = process.env.PORT || 3000;
const app = express();

app.use(compression());
app.use(favicon(currentEnvironment === 'production' ? `${__dirname}/favicon.ico` : `${__dirname}/../favicon.ico`));
app.use('/static', express.static(staticPath));
app.set('view engine', 'ejs');

Object.keys(process.env).filter(key => key.startsWith('REV_PROXY_URL_'))
    .forEach(key => {
      try {
        let config = JSON.parse(process.env[key]);
        console.info(`Adding Configuration for forward ${config['path']} traffic to -> ${config['url']}`);
        app.use(config['path'], proxy(config['url']));
      } catch (err) {
        console.error('Failed to add reverse proxy.', err)
      }
    });
	
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