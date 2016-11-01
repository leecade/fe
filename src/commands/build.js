import path from 'path'
import webpack from 'webpack'
import chalk from 'chalk'
import Listr from 'listr'
import inquirer from 'inquirer'
import webpackProdConfig from '../config/webpack.config.prod'
import rimraf from 'rimraf'
import { copySync } from 'fs-extra'
import { calcSizeMap, printFileSizes } from '../build/reporter'
import { log } from '../utils'
import { pathExists, mkdirp, touchp } from '../utils/fs'

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
  let config = webpackProdConfig(env)

  // Merge custom config
  try {
    config = require(path.join(env.CONFIG_DIR, 'webpack.config.prod.js'))(config, env)
  } catch (err) {
  }

  const compiler = webpack(config)

  let sizeMap = null
  let buildStats = null

  const tasks = new Listr([{
    title: 'Build',
    task: () => new Listr([{
      title: 'Prepare resources',
      task: async () => {
        sizeMap = await calcSizeMap(env.BUILD_DIR)
      }
    }, {
      title: 'Clean build folder',
      task: async () => rimraf.sync(env.BUILD_DIR + '/*')
    }, {
      title: 'Compile static resources',
      task: () => new Promise((resolve, reject) =>
        compiler.run(async (err, stats) => {
          if (err) reject(err)
          if (stats.compilation.errors.length) reject(stats.compilation.errors)
          buildStats = stats
          resolve()
        }))
    }, {
      title: 'Copy public folder',
      task: () => {
        env.PUBLIC_DIR && copySync(env.PUBLIC_DIR, env.BUILD_DIR, {
          dereference: true,
          filter: file => file !== env.HTML_FILE
        })
      }
    }])
  }])

  await tasks.run()
    .catch(err => {
      console.log('')
      console.error(` ${err}`)
    })

  if (buildStats) {
    console.log('')
    console.log(` ${chalk.italic.dim('File sizes after gzip:')}`)
    console.log('')
    printFileSizes(buildStats, sizeMap, env.config.BUILD_DIR, env.appRoot)
  }

  cmd.watch && compiler.watch({ // watch options:
    aggregateTimeout: 300, // wait so long for more changes
    poll: true // use polling instead of native watchers
    // pass a number to set the polling interval
  }, (err, stats) => {
    err
      ? log.error(err)
      : log.success('Built successed!')
  })
}
