import path from 'path'
import webpack from 'webpack'
import chalk from 'chalk'
import {
  log,
  wait,
  Spinner
} from '../utils'

const spinner = new Spinner()

export default async cmd => {
  const cwd = cmd.opts.projectRootPath

  // Grab the webpack config, from:
  // 1. global/config/webpack.config.build.js
  // 2. local/config/webpack.config.build.js
  const compiler = webpack({
    entry: {
      'index': [path.join(cwd, 'src/index.js')]
    },
    output: {
      path: path.join(cwd, 'dist'),
      filename: '[name].js',
      // publicPath: 'http://localhost:3000/static/'
      publicPath: ''
      // publicPath: `http://localhost:${port}/`
    }
  })

  spinner.start('running', {
    text: `Building, root path: ${chalk.magenta.underline(cwd)}`
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
