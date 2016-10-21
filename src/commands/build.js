import webpack from 'webpack'
import chalk from 'chalk'
import webpackProdConfig from '../config/webpack.config.prod'
import getPaths from '../config/getPaths'
import {
  log,
  wait,
  Spinner
} from '../utils'

const spinner = new Spinner()

export default async cmd => {
  const { projectRootPath } = cmd.opts
  // console.log('projectRootPath:', projectRootPath)
  // console.log('defaultConfig:', defaultConfig)

  const paths = getPaths(projectRootPath)
  const config = webpackProdConfig(paths)

  // Grab the webpack config, from:
  // 1. global/config/webpack.config.build.js
  // 2. local/config/webpack.config.build.js
  const compiler = webpack(config)

  spinner.start('running', {
    text: `Building, root path: ${chalk.magenta.underline(projectRootPath)}`
  })

  await wait(1)

  compiler.run((err, stats) => {
    spinner.stop()
    err
      ? log.error(err)
      : log.success('Built successed!')
  })

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
