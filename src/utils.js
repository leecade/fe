import fs from 'fs'
import chalk from 'chalk'
import path from 'path'

const symbols = process.platform === 'win32'
  ? {
    info: 'i',
    success: '√',
    warning: '‼',
    error: '×'
  }
  : {
    info: 'ℹ',
    success: '✔',
    warning: '⚠',
    error: '✖'
  }

const colors = {
  info: 'blue',
  success: 'green',
  warning: 'yellow',
  error: 'red'
}

const renderLog = type => (...args) => {
  // console.log('')
  args.map(arg => console.log(`${chalk[colors[type]](symbols[type])} ${arg}`))
}

export let log = {}

Object.keys(symbols).map(symbol => {
  log[symbol] = renderLog(symbol)
})

export const wait = time => new Promise((resolve, reject) => setTimeout(resolve, 1000 * time))

/* export const pathExists = path => new Promise(resolve => {
  fs.access(path, err => {
    resolve(!err)
  })
})*/

export const pathExists = path => {
  try {
    fs.accessSync(path)
    return true
  } catch (err) {
    return false
  }
}

function splitPath (x) {
  return path.resolve(x || '').split(path.sep)
}

function join (parts, filename) {
  return path.resolve(parts.join(path.sep) + path.sep, filename)
}

export const walkup = (filename, opts = {}) => {
  /* const parts = splitPath(opts.cwd)
  return new Promise(function (resolve) {
    ;(function find () {
      var fp = join(parts, filename)
      pathExists(fp).then(function (exists) {
        if (exists) {
          resolve(fp)
        } else if (parts.pop()) {
          find()
        } else {
          resolve(null)
        }
      })
    })()
  })*/

  let parts = splitPath(opts.cwd)
  let len = parts.length
  while (len--) {
    let fp = join(parts, filename)
    if (pathExists(fp)) {
      return fp
    }
    parts.pop()
  }

  return null
}

