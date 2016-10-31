import { join } from 'path'
import webpack from 'webpack'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import ExtractTextPlugin from 'extract-text-webpack-plugin'
import moduleResolve from '../utils/moduleResolve'

export default ({
  config,
  SRC_DIR,
  ENTRY_FILE,
  BUILD_DIR,
  CONFIG_DIR,
  TEMPLATE_FILE,
  sharedConfigPath,
  internalModulePath,
  nodePath,
  publicPath
}) => ({
  // Don't attempt to continue if there are any errors.
  bail: true,
  devtool: 'cheap-module-source-map',
  entry: [
    moduleResolve('babel-polyfill', nodePath),
    // default
    join(sharedConfigPath, 'polyfills.js'),
    // custom
    join(CONFIG_DIR, 'polyfills.js'),
    ENTRY_FILE
  ],
  output: {
    path: BUILD_DIR,
    filename: 'static/js/[name].[chunkhash:8].js',
    chunkFilename: 'static/js/[name].[chunkhash:8].chunk.js',
    publicPath
  },
  resolve: {
    // This allows you to set a fallback for where Webpack should look for modules.
    // We read `NODE_PATH` environment variable in `paths.js` and pass paths here.
    // We use `fallback` instead of `root` because we want `node_modules` to "win"
    // if there any conflicts. This matches Node resolution mechanism.
    // https://github.com/facebookincubator/create-react-app/issues/253
    // fallback: paths.nodePaths,
    // These are the reasonable defaults supported by the Node ecosystem.
    // We also include JSX as a common component filename extension to support
    // some tools, although we do not recommend using it, see:
    // https://github.com/facebookincubator/create-react-app/issues/290
    extensions: ['.js', '.json', '.jsx'],
    alias: {
      // Support React Native Web
      // https://www.smashingmagazine.com/2016/08/a-glimpse-into-the-future-with-react-native-for-web/
      'react-native': 'react-native-web',
      components: join(SRC_DIR, 'components'),
      containers: join(SRC_DIR, 'containers'),
      actions: join(SRC_DIR, 'actions'),
      reducers: join(SRC_DIR, 'reducers'),
      common: join(SRC_DIR, 'common'),
      utils: join(SRC_DIR, 'utils'),
      constants: join(SRC_DIR, 'constants')
    }
  },

  module: {
    loaders: [
      // Process JS with Babel.
      {
        test: /\.(js|jsx)$/,
        include: SRC_DIR,
        loader: 'babel-loader',
        query: {
          'presets': [
            moduleResolve('babel-preset-fe', nodePath)
          ],
          'compact': true,

          // Enables caching results in ./node_modules/.cache/babel-loader
          // directory for faster rebuilds
          cacheDirectory: true
        }
      },
      {
        test: /\.module\.css$/,
        loader: ExtractTextPlugin.extract({notExtractLoader: 'style', loader: 'css?modules&minimize'})
      },
      {
        // test: /(?<!\.module)\.css$/,
        test (filename) {
          return /\.css$/.test(filename) && !/\.module\.css$/.test(filename)
        },
        // "?-autoprefixer" disables autoprefixer in css-loader itself:
        // https://github.com/webpack/css-loader/issues/281
        // We already have it thanks to postcss. We only pass this flag in
        // production because "css" loader only enables autoprefixer-powered
        // removal of unnecessary prefixes when Uglify plugin is enabled.
        // Webpack 1.x uses Uglify plugin as a signal to minify *all* the assets
        // including CSS. This is confusing and will be removed in Webpack 2:
        // https://github.com/webpack/webpack/issues/283
        // loader: ExtractTextPlugin.extract('style', 'css?-autoprefixer!postcss')
        loader: ExtractTextPlugin.extract({notExtractLoader: 'style', loader: 'css?minimize'})
        // Note: this won't work without `new ExtractTextPlugin()` in `plugins`.
      },
      {
        test: /\.module\.styl$/,
        loader: ExtractTextPlugin.extract({notExtractLoader: 'style', loader: 'css?modules&minimize!stylus'})
      },
      {
        // test: /(?<!\.module)\.styl$/,
        test (filename) {
          return /\.styl$/.test(filename) && !/\.module\.styl$/.test(filename)
        },
        loader: ExtractTextPlugin.extract({notExtractLoader: 'style', loader: 'css?minimize!stylus'})
      },
      {
        test: /\.json$/,
        loader: 'json'
      },
      {
        test: /\.(ico|jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2)(\?.*)?$/,
        loader: 'file',
        query: {
          name: 'static/media/[name].[hash:8].[ext]'
        }
      },
      {
        test: /\.(mp4|webm|wav|mp3|m4a|aac|oga)(\?.*)?$/,
        loader: 'url',
        query: {
          limit: 10000,
          name: 'static/media/[name].[hash:8].[ext]'
        }
      }
    ]
  },

  // We use PostCSS for autoprefixing only.
  // postcss: function () {
  //   return [
  //     autoprefixer({
  //       browsers: [
  //         '>1%',
  //         'last 4 versions',
  //         'Firefox ESR',
  //         'not ie < 9' // React doesn't support IE8 anyway
  //       ]
  //     })
  //   ]
  // },
  plugins: [
    new HtmlWebpackPlugin({
      title: config.TITLE,
      hash: false,
      inject: false,
      template: TEMPLATE_FILE,
      appMountId: 'root',
      // Or
      // appMountIds: ['root', 'app'],
      window: {
        ENV: 'prod'
      },
      filename: join(BUILD_DIR, 'index.html'),
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeRedundantAttributes: true,
        useShortDoctype: true,
        removeEmptyAttributes: true,
        removeStyleLinkTypeAttributes: true,
        keepClosingSlash: true,
        minifyJS: true,
        minifyCSS: true,
        minifyURLs: true
      }
    }),
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production')
      }
    }),
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        // React doesn't support IE8
        screw_ie8: true,
        warnings: false,
        // remove `console.*`
        drop_console: true
      },
      mangle: {
        screw_ie8: true
      },
      output: {
        comments: false,
        screw_ie8: true
      }
    }),
    // Note: this won't work without ExtractTextPlugin.extract(..) in `loaders`.
    new ExtractTextPlugin({
      filename: 'static/css/[name].[contenthash:8].css',
      allChunks: true
    })
  ],
  // Some libraries import Node modules but don't use them in the browser.
  // Tell Webpack to provide empty mocks for them so importing them works.
  node: {
    fs: 'empty',
    net: 'empty',
    tls: 'empty'
  },
  resolveLoader: {
    modules: ['node_modules', internalModulePath]
  }
})
