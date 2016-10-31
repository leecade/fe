// import autoprefixer from 'autoprefixer'
import { join } from 'path'
import webpack from 'webpack'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import CaseSensitivePathsPlugin from '../plugins/CaseSensitivePathsPlugin'
import WatchMissingNodeModulesPlugin from '../plugins/WatchMissingNodeModulesPlugin'
import moduleResolve from '../utils/moduleResolve'

export default ({
  config,
  appRoot,
  nodePath,
  publicPath,
  cliRoot,
  sharedConfigPath,
  internalModulePath,
  CONFIG_DIR,
  BUILD_DIR,
  SRC_DIR,
  ENTRY_FILE,
  TEMPLATE_FILE
}) => ({
  devtool: 'cheap-module-eval-source-map',
  entry: [
    // moduleResolve('webpack-dev-server/client') + `?${config.HTTPS ? 'https' : 'http'}://${config.HOST}:${config.DEV_SERVER_PORT}`,
    // moduleResolve('webpack/hot/dev-server'),
    join(cliRoot, 'lib/plugins/webpackHotDevClient.js'),

    // We ship a few polyfills by default:
    // moduleResolve('./polyfills'),
    moduleResolve('babel-polyfill', nodePath),
    // default
    join(sharedConfigPath, 'polyfills.js'),
    // custom
    join(CONFIG_DIR, 'polyfills.js'),
    ENTRY_FILE
  ],
  output: {
    path: BUILD_DIR,
    // Add /* filename */ comments to generated require()s in the output.
    pathinfo: true,
    filename: 'static/js/bundle.js',
    publicPath: config.publicPath
  },
  resolve: {
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
            moduleResolve('babel-preset-fe')
          ],
          'compact': true,
          cacheDirectory: true
        }
      },
      {
        test: /\.module\.css$/,
        loader: 'style!css?modules'
      },
      {
        // test: /(?<!\.module)\.css$/,
        test (filename) {
          return /\.css$/.test(filename) && !/\.module\.css$/.test(filename)
        },
        loader: 'style!css'
      },
      {
        test: /\.module\.styl$/,
        loader: 'style!css?modules!stylus'
      },
      {
        // test: /(?<!\.module)\.styl$/,
        test (filename) {
          return /\.styl$/.test(filename) && !/\.module\.styl$/.test(filename)
        },
        loader: 'style!css!stylus'
      },
      {
        test: /\.json$/,
        loader: 'json'
      },
      {
        test: /\.(ico|jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2)(\?.*)?$/,
        loader: 'file',
        query: {
          name: 'static/media/[name].[ext]'
        }
      },
      {
        test: /\.(mp4|webm|wav|mp3|m4a|aac|oga)(\?.*)?$/,
        loader: 'url',
        query: {
          limit: 10000,
          name: 'static/media/[name].[ext]'
        }
      }
    ]
  },

  // We use PostCSS for autoprefixing only.
  // postcss: () => [
  //   autoprefixer({
  //     browsers: [
  //       '>1%',
  //       'last 4 versions',
  //       'Firefox ESR',
  //       'not ie < 9' // React doesn't support IE8 anyway
  //     ]
  //   })
  // ],
  plugins: [
    // Generates an `index.html` file with the <script> injected.
    new HtmlWebpackPlugin({
      title: config.TITLE,
      hash: false,
      inject: false,
      template: TEMPLATE_FILE,
      appMountId: 'root',
      // Or
      // appMountIds: ['root', 'app'],
      window: {
        ENV: 'dev'
      }
      // filename: join(paths.appBuild, 'index.html')
    }),
    new webpack.HotModuleReplacementPlugin(),
    new CaseSensitivePathsPlugin(),
    new WatchMissingNodeModulesPlugin(join(appRoot, 'node_modules'))

    // TODO
    // new NpmInstallPlugin({
    //   // Use --save or --save-dev
    //   dev: false,
    //   // Install missing peerDependencies
    //   peerDependencies: true
    // })
  ],
  node: {
    fs: 'empty',
    net: 'empty',
    tls: 'empty'
  },
  resolveLoader: {
    modules: ['node_modules', internalModulePath]
  }
})
