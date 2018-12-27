// https://webpack.js.org/guides/code-splitting/
const {resolve} = require('path');
const webpack = require('webpack');
const rxPaths = require('rxjs/_esm5/path-mapping');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ProgressPlugin = require('webpack/lib/ProgressPlugin');
const CircularDependencyPlugin = require('circular-dependency-plugin');
const {AngularCompilerPlugin} = require('@ngtools/webpack');
const {IndexHtmlWebpackPlugin} = require('@angular-devkit/build-angular/src/angular-cli-files/plugins/index-html-webpack-plugin');
const {EnvironmentPlugin} = require('webpack');
const WebpackBuildNotifierPlugin = require('webpack-build-notifier');
const DEV = 'development';

module.exports = {
  mode: DEV,
  cache: false,
  devtool: 'eval',
  entry: {
    main: `${__dirname}/../src/main.ts`,
    polyfills: `${__dirname}/../src/polyfills.ts`,
    styles: `${__dirname}/../src/static/styles/main.css`
  },
  output: {
    path: resolve('./dist'),
    filename: '[name].js',
    chunkFilename: '[name].bundle.js'
  },
  resolve: {
    extensions: ['.ts', '.js'],
    alias: rxPaths()
  },
  node: false,
  performance: {
    hints: 'warning',
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: '@ngtools/webpack'
      },
      {
        test: /\.js$/,
        exclude: /(ngfactory|ngstyle).js$/,
        enforce: 'pre',
        use: 'source-map-loader'
      },
      {
        test: /\.html$/,
        use: 'raw-loader'
      },
      {
        test: /\.css$/,
        use: ['to-string-loader', 'css-loader'],
        exclude: [resolve('./src/styles.css')]
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
        include: [resolve('./src/styles.css')]
      },
      {
        test: /\.(eot|svg|cur)$/,
        loader: 'file-loader',
        options: {
          name: `[name].[ext]`,
          limit: 10000
        }
      },
      {
        test: /\.(jpg|png|webp|gif|otf|ttf|woff|woff2|ani)$/,
        loader: 'url-loader',
        options: {
          name: `[name].[ext]`,
          limit: 10000
        }
      },
      // This hides some deprecation warnings that Webpack throws
      {
        test: /[\/\\]@angular[\/\\]core[\/\\].+\.js$/,
        parser: {system: true},
      }
    ]
  },
  plugins: [
    new WebpackBuildNotifierPlugin({
      title: "Angular Webpack Build"
    }),
    new EnvironmentPlugin({
      NODE_ENV: 'development',
      DEBUG: true
    }),
    new webpack.NamedModulesPlugin(),
    new webpack.NamedChunksPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new IndexHtmlWebpackPlugin({
      input: `${__dirname}/../src/index.html`,
      output: 'index.html',
      entrypoints: [
        'styles',
        'polyfills',
        'main',
      ]
    }),
    new AngularCompilerPlugin({
      mainPath: resolve(`${__dirname}/../src/main.ts`),
      sourceMap: true,
      nameLazyFiles: true,
      tsConfigPath: resolve(`${__dirname}/../tsconfig.json`),
      skipCodeGeneration: true,
      hostReplacementPaths: {
        [resolve('src/environments/environment.ts')]: resolve('src/environments/environment.dev.ts')
      }
    }),
    new ProgressPlugin(),
    new CircularDependencyPlugin({
      exclude: /[\\\/]node_modules[\\\/]/
    }),
    new CopyWebpackPlugin([
      {
        from: `${__dirname}/../src/static`,
        to: 'static'
      },
      {
        from: `${__dirname}/../favicon.ico`,
      }
    ])
  ]
};