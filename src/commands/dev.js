import path from 'path'
import webpack from 'webpack'
import WebpackDevServer from 'webpack-dev-server'
import inquirer from 'inquirer'
import chalk from 'chalk'
import detect from 'detect-port'
import Dashboard from 'webpack-dashboard'
import DashboardPlugin from 'webpack-dashboard/plugin'
import clearConsole from '../utils/clearConsole'
import openBrowser from '../utils/openBrowser'
import webpackDevConfig from '../config/webpack.config.dev'
import mockMiddeware from '../middleware/mockMiddeware'
// import proxyMiddeware from '../middleware/proxyMiddeware'
import {
  log
  // Spinner
} from '../utils'

// const spinner = new Spinner()

let compiler

export default async (cmd, env) => {
  if (!env.appRoot) {
    return log.warning(`No ${chalk.red.underline(env.config.FE_CONFIG_FILE)} found, make sure ${chalk.blue.underline('cd [project folder]')} or create your project through ${chalk.blue.underline('fe init <project> [boilerplate]')}`)
  }

  // Make default config
  let config = webpackDevConfig(env)

  // Merge custom config
  try {
    config = require(path.join(env.CONFIG_DIR, 'webpack.config.dev.js'))(config, env)
  } catch (err) {
  }

  const defaultPort = env.config.DEV_SERVER_PORT
  const port = await detect(defaultPort)
  // port is avilable
  if (port === defaultPort) {
    setupCompiler(config, env)
    runDevServer(config, env)
    return
  }
  clearConsole()
  const { shouldChangePort } = await inquirer.prompt({
    type: 'confirm',
    name: 'shouldChangePort',
    message: `${chalk.yellow(`Port ${chalk.underline(`:${defaultPort}`)} is occupied, Would you like to run on ${chalk.underline(`:${port}`)}?`)}`
  })
  if (!shouldChangePort) return
  env.config.DEV_SERVER_PORT = port
  setupCompiler(config, env)
  runDevServer(config, env)
}

const setupCompiler = (config, env) => {
  compiler = webpack(config)
  const dashboard = new Dashboard()
  compiler.apply(new DashboardPlugin(dashboard.setData))
}

const runDevServer = (config, env) => {
  // spinner.start('wait')
  const devServer = new WebpackDevServer(compiler, {
    compress: true,
    clientLogLevel: 'none',
    contentBase: env.config.publicPath,
    hot: true,
    publicPath: env.config.publicPath,
    quiet: true,
    watchOptions: {
      ignored: /node_modules/
    },
    https: env.config.HTTPS,
    host: env.config.HOST,
    proxy: env.config.PROXY,
    historyApiFallback: {
      disableDotRule: true,

      // Discharge mock rule
      rewrites: [{
        from: new RegExp(`^\\${env.config.MOCK_PREFIX}`),
        to: ctx => ctx.parsedUrl.href
      }]
    }
  })

  // proxyMiddeware(devServer.app, env.config.PROXY)
  mockMiddeware(devServer.app, env)
  devServer.listen(env.config.DEV_SERVER_PORT, (err, result) => {
    if (err) {
      return console.log(err)
    }

    // spinner.start('done', {
    //   text: `DevServer & MockMiddeware: ${env.config.HTTPS ? 'https' : 'http'}://${env.config.HOST}:${env.config.DEV_SERVER_PORT}`
    // })

    // clearConsole()
    // console.log(chalk.cyan('Starting the development server...'))
    // console.log()
    openBrowser(`${env.config.HTTPS ? 'https' : 'http'}://${env.config.HOST}:${env.config.DEV_SERVER_PORT}`)
  })
}
