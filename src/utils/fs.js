import fs from 'fs'
import path from 'path'
import findup from 'findup'
import recursive from 'recursive-readdir'

export const pathExists = path => new Promise(resolve => {
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
    resolve(data.filter(dir => fs.statSync(path.join(parent, dir)).isDirectory()))
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
