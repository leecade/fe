import path from 'path'
import chokidar from 'chokidar'
import {
  // log,
  // wait,
  ListenerManager,
  Spinner
} from '../utils'

import {
  // devServer
  // mockServer
} from '../dev/'

// import webpack from 'webpack'

const spinner = new Spinner()

/*
watch

mock

hotload

complile
 */
const PORT = 3001

class Server {
  constructor (cwd, mockPath) {
    this.listenerManager = null
    this.mockPath = mockPath
    this.cwd = cwd
  }
  restart () {
    delete require.cache[require.resolve('../dev/devServer')]
    delete require.cache[require.resolve('../dev/mockServer')]
    /* Object.keys(require.cache).forEach(modulePath => {
      // delete require.cache[modulePath]

      // console.log(this.mockPath)
      // console.log(modulePath)
      if (~modulePath.indexOf(this.mockPath)) {
        console.log(modulePath)
        delete require.cache[modulePath]
      }

      if (~modulePath.indexOf('devServer')) {
        delete require.cache[modulePath]
      }

      if (~modulePath.indexOf('mockServer')) {
        delete require.cache[modulePath]
      }
    })*/

    this.stop()
    this.start()
  }
  start (cb) {
    let devServer = require('../dev/devServer').default
    let mockServer = require('../dev/mockServer').default
    devServer.context.cwd = this.cwd
    mockServer(devServer)
    let server = devServer.listen(PORT, () => {
      cb && cb.call(this)
      // console.log(`Server started on ${PORT}`)
    })
    this.listenerManager = new ListenerManager(server)
  }
  stop () {
    this.listenerManager && this.listenerManager.dispose()
  }
}

export default async cmd => {
/*  mockServer(devServer)
  let server = devServer.listen(PORT, () => {
    console.log(`Server started on ${PORT}`)
  })
  let listenerManager = new ListenerManager(server)

  // await wait(4)*/
  spinner.start('wait')
  const mockPath = path.join(cmd.opts.projectRootPath, 'MOCK')
  let server = new Server(cmd.opts.projectRootPath, mockPath)
  server.start(() => {
    spinner.start('done', {
      text: `MockServer: http://127.0.0.1:${PORT}`
    })
  })
  // watch
  const watcher = chokidar.watch(mockPath)
  watcher.on('ready', () => {
    watcher
      .on('add', server.restart.bind(server))
      .on('addDir', server.restart.bind(server))
      .on('change', server.restart.bind(server))
      .on('unlink', server.restart.bind(server))
      .on('unlinkDir', server.restart.bind(server))
  })

  // spinner.start('running')
  // await wait(2)
  // spinner.start('done')
  // await wait(2)
  // spinner.start('error')
  // await wait(2)
}

/*
var WebpackDevServer = require("webpack-dev-server");
var webpack = require("webpack");

var compiler = webpack({
  // configuration
});

var server = new WebpackDevServer(compiler, {
  // webpack-dev-server options

  contentBase: "/path/to/directory",
  // or: contentBase: "http://localhost/",

  hot: true,
  // Enable special support for Hot Module Replacement
  // Page is no longer updated, but a "webpackHotUpdate" message is send to the content
  // Use "webpack/hot/dev-server" as additional module in your entry point
  // Note: this does _not_ add the `HotModuleReplacementPlugin` like the CLI option does.

  // Set this as true if you want to access dev server from arbitrary url.
  // This is handy if you are using a html5 router.
  historyApiFallback: false,

  // Set this if you want to enable gzip compression for assets
  compress: true,

  // Set this if you want webpack-dev-server to delegate a single path to an arbitrary server.
  // Use "*" to proxy all paths to the specified server.
  // This is useful if you want to get rid of 'http://localhost:8080/' in script[src],
  // and has many other use cases (see https://github.com/webpack/webpack-dev-server/pull/127 ).
  proxy: {
    "*": "http://localhost:9090"
  },

  // pass [static options](http://expressjs.com/en/4x/api.html#express.static) to inner express server
  staticOptions: {
  },

  // webpack-dev-middleware options
  quiet: false,
  noInfo: false,
  lazy: true,
  filename: "bundle.js",
  watchOptions: {
    aggregateTimeout: 300,
    poll: 1000
  },
  publicPath: "/assets/",
  headers: { "X-Custom-Header": "yes" },
  stats: { colors: true }
});
server.listen(8080, "localhost", function() {});
// server.close();*/
