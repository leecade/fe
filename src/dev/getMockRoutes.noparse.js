const fs = require('fs')
const path = require('path')
const chokidar = require('chokidar')
const getSubDirs = parent => fs
  .readdirSync(parent)
  .filter(dir => fs.statSync(path.join(parent, dir)).isDirectory())
/*
├── mock
│└── TaskList
│    ├── index.js
│    └── task-list.json
 */
const MOCK = 'mock'

module.exports = cwd => {
  const mockPath = path.join(cwd, MOCK)
  const mockPaths = getSubDirs(mockPath)
  const watcher = chokidar.watch(mockPath)
  watcher.on('ready', () => {
    watcher
      // .on('add', compileHotServer)
      // .on('addDir', compileHotServer)
      .on('change', () => {
        Object.keys(require.cache).forEach(modulePath => {
          // console.log(modulePath)
          if (~modulePath.indexOf(mockPath)) {
            delete require.cache[modulePath]
          }
        })
      })
      // .on('unlink', compileHotServer)
      // .on('unlinkDir', compileHotServer)
  })

  return mockPaths.map(item => {
    let result = []
    try {
      result = require(path.join(mockPath, item))
    } catch (err) {
      console.log(err)
    }
    return result
  })
}
