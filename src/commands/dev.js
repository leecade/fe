import path from 'path'
import webpack from 'webpack'
import WebpackDevServer from 'webpack-dev-server'
import inquirer from 'inquirer'
import chalk from 'chalk'
import detect from 'detect-port'
import { copySync } from 'fs-extra'
import Dashboard from 'webpack-dashboard'
import DashboardPlugin from 'webpack-dashboard/plugin'
import clearConsole from '../utils/clearConsole'
import openBrowser from '../utils/openBrowser'
import webpackDevConfig from '../config/webpack.config.dev'
import mockMiddeware from '../middleware/mockMiddeware'
// import proxyMiddeware from '../middleware/proxyMiddeware'
import { watch, touchp, pathExists, mkdirp } from '../utils/fs'
import {
  // wait,
  log
  // Spinner
} from '../utils'

// const spinner = new Spinner()

let compiler
const syncPublic = env => env.PUBLIC_DIR && copySync(env.PUBLIC_DIR, env.BUILD_DIR, {
  dereference: true,
  filter: file => file !== env.HTML_FILE
})

export default async (cmd, env) => {
  if (!env.appRoot) {
    return log.warning(`No ${chalk.red.underline(env.config.FE_CONFIG_FILE)} found, make sure ${chalk.blue.underline('cd [project folder]')} or create your project through ${chalk.blue.underline('fe init <project> [boilerplate]')}`)
  }

  if (!env.ENTRY_FILE) {
    const { genEntry } = await inquirer.prompt({
      message: `No entry file found, Would you want to auto generate ${chalk.red.underline(env.config.ENTRY_FILE)}?`,
      name: 'genEntry',
      default: true,
      type: 'confirm'
    })
    if (!genEntry) return
    env.ENTRY_FILE = path.join(env.appRoot, env.config.ENTRY_FILE)
    env.SRC_DIR = env.SRC_DIR || path.join(env.appRoot, env.config.SRC_DIR)
    await touchp(env.ENTRY_FILE)
  }

  // Make sure BUILD_DIR exist
  const buildDirExist = await pathExists(env.BUILD_DIR)
  if (!buildDirExist) {
    env.BUILD_DIR = path.join(env.appRoot, env.config.BUILD_DIR)
    await mkdirp(env.BUILD_DIR)
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

const setupSyncPublic = env => {
  syncPublic(env)

  // TODO:
  // maybe should handle delete in dev mode
  watch(env.PUBLIC_DIR, () => {
    syncPublic(env)
  })
}

const runDevServer = (config, env) => {
  // spinner.start('wait')
  const devServer = new WebpackDevServer(compiler, {
    compress: true,
    clientLogLevel: 'none',
    // contentBase: env.config.publicPath,
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
  env.MOCK_DIR && mockMiddeware(devServer.app, env)

  // Watch public => static
  env.PUBLIC_DIR && setupSyncPublic(env)

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
