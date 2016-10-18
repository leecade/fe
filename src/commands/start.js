import webpack from 'webpack'
import WebpackDevServer from 'webpack-dev-server'
import webpackDevConfig from '../config/webpack.config.dev'
import getPaths from '../config/getPaths'
import inquirer from 'inquirer'
import chalk from 'chalk'
import detect from 'detect-port'
import clearConsole from '../utils/clearConsole'
import openBrowser from '../utils/openBrowser'
import Dashboard from 'webpack-dashboard'
import DashboardPlugin from 'webpack-dashboard/plugin'
import { Spinner } from '../utils'

import {
  mockServer
} from '../dev/'

const spinner = new Spinner()

let compiler

export default async cmd => {
  const { projectRootPath, defaultConfig } = cmd.opts
  // console.log('projectRootPath:', projectRootPath)
  // console.log('defaultConfig:', defaultConfig)

  const paths = getPaths(projectRootPath)
  const config = webpackDevConfig(paths)
  const host = defaultConfig.HOST
  const defaultPort = defaultConfig.DEV_SERVER_PORT
  const protocol = defaultConfig.HTTPS ? 'https' : 'http'
  const port = await detect(defaultPort)

  // port is avilable
  if (port === defaultPort) {
    setupCompiler({ host, port, protocol, paths, config })
    runDevServer({ host, port, protocol, paths, config })
    return
  }
  clearConsole()
  const { shouldChangePort } = await inquirer.prompt({
    type: 'confirm',
    name: 'shouldChangePort',
    message: `${chalk.yellow(`Port ${chalk.underline(`:${defaultPort}`)} is occupied, Would you like to run on ${chalk.underline(`:${port}`)}?`)}`
  })
  if (!shouldChangePort) return
  setupCompiler({ host, port, protocol, paths, config })
  runDevServer({ host, port, protocol, paths, config })
  // Mock server
  console.log('hi3')
}

const setupCompiler = ({ host, port, protocol, config }) => {
  compiler = webpack(config)
  const dashboard = new Dashboard()
  compiler.apply(new DashboardPlugin(dashboard.setData))
}

const runDevServer = ({ host, port, protocol, paths, config }) => {
  spinner.start('wait')
  const devServer = new WebpackDevServer(compiler, {
    // Silence WebpackDevServer's own logs since they're generally not useful.
    // It will still show compile warnings and errors with this setting.
    clientLogLevel: 'none',
    // By default WebpackDevServer serves physical files from current directory
    // in addition to all the virtual build products that it serves from memory.
    // This is confusing because those files won’t automatically be available in
    // production build folder unless we copy them. However, copying the whole
    // project directory is dangerous because we may expose sensitive files.
    // Instead, we establish a convention that only files in `public` directory
    // get served. Our build script will copy `public` into the `build` folder.
    // In `index.html`, you can get URL of `public` folder with %PUBLIC_PATH%:
    // <link rel="shortcut icon" href="%PUBLIC_URL%/favicon.ico">
    // In JavaScript code, you can access it with `process.env.PUBLIC_URL`.
    // Note that we only recommend to use `public` folder as an escape hatch
    // for files like `favicon.ico`, `manifest.json`, and libraries that are
    // for some reason broken when imported through Webpack. If you just want to
    // use an image, put it in `src` and `import` it from JavaScript instead.
    contentBase: paths.appPublic,
    // Enable hot reloading server. It will provide /sockjs-node/ endpoint
    // for the WebpackDevServer client so it can learn when the files were
    // updated. The WebpackDevServer client is included as an entry point
    // in the Webpack development configuration. Note that only changes
    // to CSS are currently hot reloaded. JS changes will refresh the browser.
    hot: true,
    // It is important to tell WebpackDevServer to use the same "root" path
    // as we specified in the config. In development, we always serve from /.
    publicPath: config.output.publicPath,
    // WebpackDevServer is noisy by default so we emit custom message instead
    // by listening to the compiler events with `compiler.plugin` calls above.
    quiet: true,
    // Reportedly, this avoids CPU overload on some systems.
    // https://github.com/facebookincubator/create-react-app/issues/293
    watchOptions: {
      ignored: /node_modules/
    },
    // Enable HTTPS if the HTTPS environment variable is set to 'true'
    https: protocol === 'https',
    host: host
  })

  // Our custom middleware proxies requests to /index.html or a remote API.
  // addMiddleware(devServer)
  mockServer(devServer.app, paths.appRoot)

  // Launch WebpackDevServer.
  devServer.listen(port, (err, result) => {
    if (err) {
      return console.log(err)
    }

    spinner.start('done', {
      text: `MockServer: http://127.0.0.1:3000`
    })

    // clearConsole()
    // console.log(chalk.cyan('Starting the development server...'))
    // console.log()
    openBrowser(protocol + '://' + host + ':' + port + '/')
  })
}
