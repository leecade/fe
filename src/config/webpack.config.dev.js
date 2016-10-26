// import autoprefixer from 'autoprefixer'
import path from 'path'
import webpack from 'webpack'
import findCacheDir from 'find-cache-dir'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import CaseSensitivePathsPlugin from 'case-sensitive-paths-webpack-plugin'
import InterpolateHtmlPlugin from '../utils/InterpolateHtmlPlugin'
import WatchMissingNodeModulesPlugin from '../utils/WatchMissingNodeModulesPlugin'
import moduleResolve from '../utils/moduleResolve'

// import NpmInstallPlugin from 'npm-install-webpack-plugin'

// console.log(123, module.paths)
// console.log(981, path.resolve('fe/utils/webpackHotDevClient'))

export default paths => ({
  devtool: 'eval',
  // These are the "entry points" to our application.
  // This means they will be the "root" imports that are included in JS bundle.
  // The first two entry points enable "hot" CSS and auto-refreshes for JS.
  entry: [
    // Include an alternative client for WebpackDevServer. A client's job is to
    // connect to WebpackDevServer by a socket and get notified about changes.
    // When you save a file, the client will either apply hot updates (in case
    // of CSS changes), or refresh the page (in case of JS changes). When you
    // make a syntax error, this client will display a syntax error overlay.
    // Note: instead of the default WebpackDevServer client, we use a custom one
    // to bring better experience for Create React App users. You can replace
    // the line below with these two lines if you prefer the stock client:
    moduleResolve('webpack-dev-server/client') + '?http://localhost:3000',
    moduleResolve('webpack/hot/dev-server'),

    // moduleResolve('../utils/webpackHotDevClient'),
    // moduleResolve('fe/lib/utils/webpackHotDevClient'),

    // We ship a few polyfills by default:
    // moduleResolve('./polyfills'),
    moduleResolve('babel-polyfill'),
    moduleResolve('fe/lib/config/polyfills'),
    // Finally, this is your app's code:
    paths.appEntry
    // We include the app code last so that if there is a runtime error during
    // initialization, it doesn't blow up the WebpackDevServer client, and
    // changing JS code would still trigger a refresh.
  ],
  output: {
    // Next line is not used in dev but WebpackDevServer crashes without it:
    path: paths.appBuild,
    // Add /* filename */ comments to generated require()s in the output.
    pathinfo: true,
    // This does not produce a real file. It's just the virtual path that is
    // served by WebpackDevServer in development. This is the JS bundle
    // containing code from all our entry points, and the Webpack runtime.
    filename: 'static/js/bundle.js',
    // This is the URL that app is served from. We use "/" in development.
    publicPath: '/'
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
      components: path.join(paths.appSrc, 'components'),
      containers: path.join(paths.appSrc, 'containers'),
      actions: path.join(paths.appSrc, 'actions'),
      reducers: path.join(paths.appSrc, 'reducers'),
      common: path.join(paths.appSrc, 'common'),
      utils: path.join(paths.appSrc, 'utils'),
      constants: path.join(paths.appSrc, 'constants')
    }
  },

  module: {
    // First, run the linter.
    // It's important to do this before Babel processes the JS.
    // preLoaders: [
    //   {
    //     test: /\.(js|jsx)$/,
    //     loader: 'eslint',
    //     include: paths.appSrc
    //   }
    // ],
    loaders: [
      // Process JS with Babel.
      {
        test: /\.(js|jsx)$/,
        include: paths.appSrc,
        loader: 'babel-loader',
        query: {
          'presets': [
            moduleResolve('babel-preset-fe')
          ],
          'compact': true,

          // This is a feature of `babel-loader` for webpack (not Babel itself).
          // It enables caching results in ./node_modules/.cache/react-scripts/
          // directory for faster rebuilds. We use findCacheDir() because of:
          // https://github.com/facebookincubator/create-react-app/issues/483
          cacheDirectory: findCacheDir({
            name: 'babel-loader'
          })
        }
      },
      // "postcss" loader applies autoprefixer to our CSS.
      // "css" loader resolves paths in CSS and adds assets as dependencies.
      // "style" loader turns CSS into JS modules that inject <style> tags.
      // In production, we use a plugin to extract that CSS to a file, but
      // in development "style" loader enables hot editing of CSS.
      {
        test: /\.module\.css$/,
        loader: 'style!css?modules'
      },
      {
        test: /(?!\.module)\.css$/,
        loader: 'style!css'
      },
      {
        test: /\.module\.styl$/,
        loader: 'style!css?modules!stylus'
      },
      // {
      //   test: /(?!\.module)\.styl$/,
      //   loader: 'style!css!stylus'
      // },
      // JSON is not enabled by default in Webpack but both Node and Browserify
      // allow it implicitly so we also enable it.
      {
        test: /\.json$/,
        loader: 'json'
      },
      // "file" loader makes sure those assets get served by WebpackDevServer.
      // When you `import` an asset, you get its (virtual) filename.
      // In production, they would get copied to the `build` folder.
      {
        test: /\.(ico|jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2)(\?.*)?$/,
        loader: 'file',
        query: {
          name: 'static/media/[name].[hash:8].[ext]'
        }
      },
      // "url" loader works just like "file" loader but it also embeds
      // assets smaller than specified size as data URLs to avoid requests.
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
    // Makes the public URL available as %PUBLIC_URL% in index.html, e.g.:
    // <link rel="shortcut icon" href="%PUBLIC_URL%/favicon.ico">
    // In development, this will be an empty string.
    new InterpolateHtmlPlugin({
      PUBLIC_URL: ''
    }),
    // Generates an `index.html` file with the <script> injected.
    new HtmlWebpackPlugin({
      title: '',
      hash: false,
      inject: false,
      template: paths.appTemplate,
      appMountId: 'root',
      // Or
      // appMountIds: ['root', 'app'],
      window: {
        ENV: 'prod'
      }
      // filename: path.join(paths.appBuild, 'index.html')
    }),
    // Makes some environment variables available to the JS code, for example:
    // if (process.env.NODE_ENV === 'development') { ... }. See `./env.js`.
    // new webpack.DefinePlugin(env),
    // This is necessary to emit hot updates (currently CSS only):
    new webpack.HotModuleReplacementPlugin(),
    // Watcher doesn't work well if you mistype casing in a path so we use
    // a plugin that prints an error when you attempt to do this.
    // See https://github.com/facebookincubator/create-react-app/issues/240
    new CaseSensitivePathsPlugin(),
    // If you require a missing module and then `npm install` it, you still have
    // to restart the development server for Webpack to discover it. This plugin
    // makes the discovery automatic so you don't have to restart.
    // See https://github.com/facebookincubator/create-react-app/issues/186
    new WatchMissingNodeModulesPlugin(paths.appNodeModules)

    // TODO
    // new NpmInstallPlugin({
    //   // Use --save or --save-dev
    //   dev: false,
    //   // Install missing peerDependencies
    //   peerDependencies: true
    // })
  ],
  // Some libraries import Node modules but don't use them in the browser.
  // Tell Webpack to provide empty mocks for them so importing them works.
  node: {
    fs: 'empty',
    net: 'empty',
    tls: 'empty'
  },
  resolveLoader: {
    // An array of directory names to be resolved to the current directory
    modules: ['node_modules', path.resolve(moduleResolve('fe/package.json'), '..', 'node_modules')]
  }
})
