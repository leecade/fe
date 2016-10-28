import webpack from 'webpack'
import chalk from 'chalk'
import { readFileSync } from 'fs'
import path from 'path'
import webpackProdConfig from '../config/webpack.config.prod'
import getPaths from '../config/getPaths'
import gzipSize from 'gzip-size'
import filesize from 'filesize'
import stripAnsi from 'strip-ansi'
import rimraf from 'rimraf'
import {
  log,
  // wait,
  Spinner,
  recursiveDir,
  removeFileNameHash
} from '../utils'

const spinner = new Spinner()

 // Input: 1024, 2048
// Output: "(+1 KB)"
const getDifferenceLabel = (currentSize, previousSize) => {
  const FIFTY_KILOBYTES = 1024 * 50
  const difference = currentSize - previousSize
  const fileSize = !Number.isNaN(difference) ? filesize(difference) : 0
  if (difference >= FIFTY_KILOBYTES) {
    return chalk.red('+' + fileSize)
  } else if (difference < FIFTY_KILOBYTES && difference > 0) {
    return chalk.yellow('+' + fileSize)
  } else if (difference < 0) {
    return chalk.green(fileSize)
  } else {
    return ''
  }
}

const printFileSizes = (stats, previousSizeMap, appBuild) => {
  const assets = stats.toJson().assets
    .filter(asset => /\.(js|css)$/.test(asset.name))
    .map(asset => {
      const fileContents = readFileSync(appBuild + '/' + asset.name)
      const size = gzipSize.sync(fileContents)
      const previousSize = previousSizeMap[removeFileNameHash(asset.name)]
      const difference = getDifferenceLabel(size, previousSize)
      return {
        folder: path.join('build', path.dirname(asset.name)),
        name: path.basename(asset.name),
        size: size,
        sizeLabel: filesize(size) + (difference ? ' (' + difference + ')' : '')
      }
    })
  assets.sort((a, b) => b.size - a.size)
  const longestSizeLabelLength = Math.max.apply(null,
    assets.map(a => stripAnsi(a.sizeLabel).length)
  )
  assets.forEach(asset => {
    let sizeLabel = asset.sizeLabel
    const sizeLength = stripAnsi(sizeLabel).length
    if (sizeLength < longestSizeLabelLength) {
      const rightPadding = ' '.repeat(longestSizeLabelLength - sizeLength)
      sizeLabel += rightPadding
    }
    console.log(
      '  ' + sizeLabel +
      '  ' + chalk.dim(asset.folder + path.sep) + chalk.cyan(asset.name)
    )
  })
}

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

  const fileNames = await recursiveDir(paths.appBuild)
    .catch(err => console.log(err))

  const previousSizeMap = (fileNames || [])
    .filter(fileName => /\.(js|css)$/.test(fileName))
    .reduce((memo, fileName) => {
      var contents = readFileSync(fileName)
      var key = removeFileNameHash(fileName, paths.appBuild)
      memo[key] = gzipSize.sync(contents)
      return memo
    }, {})

  spinner.start('cleanning', {
    text: `cleanning build path: ${chalk.magenta.underline(paths.appBuild)}`
  })
  rimraf.sync(paths.appBuild + '/*')
  spinner.stop()
  log.success(`Clean ${chalk.magenta.underline(paths.appBuild)} successfully!`)
  // await wait(1)
  spinner.start('running', {
    text: `Building, root path: ${chalk.magenta.underline(projectRootPath)}`
  })

  compiler.run((err, stats) => {
    spinner.stop()
    if (err) return log.error('Failed to compile', err)
    if (stats.compilation.errors.length) return log.error('Failed to compile', stats.compilation.errors)
    log.success('Compiled successfully!')

    console.log()
    console.log('File sizes after gzip:')
    console.log()
    printFileSizes(stats, previousSizeMap, paths.appBuild)
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
