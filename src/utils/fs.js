import fs from 'fs'
import findup from 'findup'
import mkdirP from 'mkdirp'
import recursive from 'recursive-readdir'
import chokidar from 'chokidar'
import {
  join,
  dirname
} from 'path'

export const pathExists = path => new Promise(resolve => {
  if (!path) resolve(false)
  fs.access(path, err => {
    resolve(!err)
  })
})

export const findRoot = (filename, dir) => {
  try {
    return findup.sync(dir, filename)
  } catch (err) {
    // not found
    return null
  }
}

export const getSubDirs = parent => new Promise((resolve, reject) => {
  fs.readdir(parent, (err, data) => {
    if (err) return reject(err)
    resolve(data.filter(dir => fs.statSync(join(parent, dir)).isDirectory()))
  })
})

export const recursiveDir = (path, ignore = []) => new Promise((resolve, reject) => {
  recursive(path, ignore, (err, files) => {
    if (err) return reject(err)
    resolve(files)
  })
})

// Merge and save config as file
export const saveConfig = (config = {}, configPath) => {
  try {
    config = Object.assign(require(configPath), config)
  } catch (err) {}
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2))
}

export const removeFileNameHash = (fileName, path) => fileName
  .replace(path, '')
  .replace(/\/?(.*)(\.\w+)(\.js|\.css)/, (match, p1, p2, p3) => p1 + p3)

export const mkdirp = (path, opts) => new Promise((resolve, reject) => mkdirP(path, opts, (err, made) =>
    err === null ? resolve(made) : reject(err)))

// touch
// force: the file to be empty
export const touchp = async (filepath, force) => {
  await mkdirp(dirname(filepath))
  const exist = await pathExists(filepath)
  !(exist && !force) && fs.writeFileSync(filepath)
  // fs.closeSync(fs.openSync(filepath, 'w'))
}

export const watch = (path, onChange) => {
  const watcher = chokidar.watch(path)
  watcher.on('ready', () => {
    watcher.on('add', onChange)
      .on('add', onChange)
      .on('addDir', onChange)
      .on('change', onChange)
      .on('unlink', onChange)
      .on('unlinkDir', onChange)
  })
}
