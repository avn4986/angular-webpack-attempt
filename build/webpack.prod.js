// https://webpack.js.org/configuration/devtool
// https://medium.com/@selvarajchinnasamyks/angular-7-unit-testing-97dccfdca900
const {resolve} = require('path');
const rxPaths = require('rxjs/_esm5/path-mapping');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ProgressPlugin = require('webpack/lib/ProgressPlugin');
const CircularDependencyPlugin = require('circular-dependency-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const {CleanCssWebpackPlugin} = require('@angular-devkit/build-angular/src/angular-cli-files/plugins/cleancss-webpack-plugin');
const {AngularCompilerPlugin} = require('@ngtools/webpack');
const {IndexHtmlWebpackPlugin} = require('@angular-devkit/build-angular/src/angular-cli-files/plugins/index-html-webpack-plugin');
const {SuppressExtractedTextChunksWebpackPlugin} = require('@angular-devkit/build-angular/src/angular-cli-files/plugins/suppress-entry-chunks-webpack-plugin');
const {HashedModuleIdsPlugin, EnvironmentPlugin} = require('webpack');
const PROD = 'production';
const buildRoot = './dist';
module.exports = {
  mode: PROD,
  devtool: false,
  entry: {
    main: `${__dirname}/../src/main.ts`,
    polyfills: `${__dirname}/../src/polyfills.ts`,
    styles: `${__dirname}/../src/static/styles/main.css`
  },
  output: {
    path: resolve(buildRoot),
    filename: '[name].js',
    chunkFilename: '[name].bundle.js'
  },
  resolve: {
    extensions: ['.ts', '.js', '.css'],
    alias: {
      ...rxPaths(),
      '~': resolve('node_modules'),
    }
  },
  node: false,
  performance: {
    hints: false,
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: '@ngtools/webpack'
      },
      {
        test: /\.js$/,
        loader: '@angular-devkit/build-optimizer/webpack-loader',
        options: {sourceMap: true}
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
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
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

  optimization: {
    noEmitOnErrors: true,
    runtimeChunk: 'single',
    splitChunks: {
      cacheGroups: {
        default: {
          chunks: 'async',
          minChunks: 2,
          priority: 10
        },
        common: {
          name: 'common',
          chunks: 'async',
          minChunks: 2,
          enforce: true,
          priority: 5
        },
        vendors: false,
        vendor: false
      }
    },
    minimizer: [
      new HashedModuleIdsPlugin(),
      new UglifyJSPlugin({
        sourceMap: false,
        cache: true,
        parallel: true,
        uglifyOptions: {
          safari10: true,
          output: {
            ascii_only: true,
            comments: false,
            webkit: true,
          },
          compress: {
            pure_getters: true,
            passes: 3,
            inline: 3,
          }
        }
      }),
      new CleanCssWebpackPlugin({
        sourceMap: true,
        test: (file) => /\.(?:css)$/.test(file),
      })
    ]
  },

  plugins: [
    new EnvironmentPlugin({
      NODE_ENV: 'production',
      DEBUG: false
    }),
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
      skipCodeGeneration: false,
      hostReplacementPaths: {
        [resolve('src/environments/environment.ts')]: resolve('src/environments/environment.prod.ts')
      }
    }),
    new MiniCssExtractPlugin({filename: '[name].css'}),
    new SuppressExtractedTextChunksWebpackPlugin(),
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
      },
      {
        from: `${__dirname}/server.js`,
      },
      {
        from: `${__dirname}/../pack*.json`,
        transform: (content) => {
          let parsedContent;
          try {
            parsedContent = JSON.parse(content.toString());
            delete parsedContent['devDependencies']
          } catch (err) {
            console.error('Failed to modify package.json', err);
            parsedContent = content.toString()
          }
          return JSON.stringify(parsedContent)
        }
      }
    ])
  ]
};