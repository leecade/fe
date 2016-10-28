import fs from 'fs'
import path from 'path'
import chalk from 'chalk'
import ora from 'ora'
import findup from 'findup'
import recursive from 'recursive-readdir'

export class Spinner {
  constructor () {
    this.defaultConfig = {
      text: 'waiting'
    }
    this.configs = {
      wait: {
        text: 'Init building may take more time, please be patient',
        color: 'white',
        spinner: 'clock'
      },
      running: {
        text: 'Re-building',
        color: 'yellow',
        spinner: 'runner'
      },
      done: {
        text: 'http://127.0.0.1:3000',
        color: 'green',
        spinner: 'earth'
      },
      error: {
        text: 'Got a error: TODO',
        color: 'red',
        spinner: {
          interval: 0,
          frames: [
            '✖ '
          ]
        }
      }
    }
  }

  stop () {
    this.spinner && this.spinner.stop()
  }

  /*
  spinner.start('done')
  spinner.start('done', {text: 'done'})
  spinner.start({text: 'done'})
   */
  start (type = this.defaultConfig, option = {}) {
    let opt = {}
    opt = type + '' === type
      ? Object.assign({}, this.configs[type] || {}, option)
      : type
    this.stop()
    this.spinner = ora(opt).start()
  }
}

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
  console.log('')
  args.map(arg => console.log(`${chalk[colors[type]](symbols[type])} ${arg}`))
}

export let log = {}

Object.keys(symbols).map(symbol => {
  log[symbol] = renderLog(symbol)
})

export const wait = time => new Promise((resolve, reject) => setTimeout(resolve, 1000 * time))

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

export const removeFileNameHash = (fileName, path) => fileName
  .replace(path, '')
  .replace(/\/?(.*)(\.\w+)(\.js|\.css)/, (match, p1, p2, p3) => p1 + p3)

export class ListenerManager {
  constructor (listener) {
    this.key = 0
    this.connections = {}
    this.listener = listener
    this.listener.on('connection', conn => {
      const key = ++this.key
      this.connections[key] = conn
      conn.on('close', () => {
        delete this.connections[key]
      })
    })
  }
  dispose () {
    return new Promise(resolve => {
      Object.keys(this.connections).forEach(key => this.connections[key].destroy())
      if (this.listener) {
        this.listener.close(() => resolve())
      } else {
        resolve()
      }
    })
  }
}
