import path from 'path'
import chalk from 'chalk'
import filesize from 'filesize'
import stripAnsi from 'strip-ansi'
import gzipSize from 'gzip-size'
import { readFileSync } from 'fs'
import {
  recursiveDir,
  removeFileNameHash
} from '../utils/fs'

 // Input: 1024, 2048
// Output: "(+1 KB)"
const getDifferenceLabel = (size, prevSize) => {
  const FIFTY_KILOBYTES = 1024 * 50
  const difference = size - prevSize
  const fileSize = !Number.isNaN(difference) ? filesize(difference) : 0
  if (difference >= FIFTY_KILOBYTES) {
    return chalk.red('+' + fileSize)
  }
  if (difference < FIFTY_KILOBYTES && difference > 0) {
    return chalk.yellow('+' + fileSize)
  }
  if (difference < 0) {
    return chalk.green(fileSize)
  }
  return ''
}

export const calcSizeMap = async (buildDir) => {
  const files = await recursiveDir(buildDir)
    .catch(err => console.log(err))
  return files
    .filter(file => /\.(js|css)$/.test(file))
    .reduce((map, file) => {
      map[removeFileNameHash(file, buildDir)] = gzipSize.sync(readFileSync(file))
      return map
    }, {})
}

export const printFileSizes = (stats, sizeMap, buildDir, appRoot) => {
  const assets = stats.toJson().assets
    .filter(asset => /\.(js|css)$/.test(asset.name))
    .map(asset => {
      const size = gzipSize.sync(readFileSync(path.join(appRoot, buildDir, asset.name)))
      const prevSize = sizeMap[removeFileNameHash(asset.name)]
      const diff = getDifferenceLabel(size, prevSize)
      return {
        folder: path.join(buildDir, path.dirname(asset.name)),
        name: path.basename(asset.name),
        size: size,
        sizeLabel: `${filesize(size)}${diff ? `(${diff})` : ''}`
      }
    })
  assets.sort((a, b) => b.size - a.size)
  const longestSizeLabelLength = Math.max.apply(null, assets.map(a => stripAnsi(a.sizeLabel).length))
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
