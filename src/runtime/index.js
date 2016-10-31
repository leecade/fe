import path from 'path'
import request from 'request'
import execa from 'execa'
import osenv from 'osenv'
import {
  findRoot,
  saveConfig
} from '../utils/fs'
import defaultConfig from '../config/default'

const { assign, keys } = Object

const isInChina = (url = 'https://google.com') =>
  new Promise(resolve => {
    let timer = setTimeout(() => {
      req.abort()
      resolve(true)
    }, 2000)
    let req = request({
      url,
      timeout: 0
    }, err => {
      clearTimeout(timer)
      resolve(!!(err && ~(err + '').indexOf('getaddrinfo ENOTFOUND')))
    })
  })

/**
 * Detect usefully runtime info
 * @return {[type]} [description]
 */
export default async pkg => {
  const dirname = __dirname
  const cwd = process.cwd()
  const appRoot = findRoot(defaultConfig.FE_CONFIG_FILE, cwd)
  const config = assign({}, defaultConfig)
  let customConfig = {}

  try {
    customConfig = require(path.join(appRoot, defaultConfig.FE_CONFIG_FILE))
  } catch (err) {
    // console.log(err)
  }
  // Merge custom configure
  assign(config, customConfig)

  // const prefix = execa.shellSync('npm get prefix').stdout
  // const npmRoot = `${stdout}/lib/node_modules`
  const npmRoot = execa.shellSync('npm root -g').stdout

  const resolveApp = relativePath => appRoot && relativePath
    ? path.resolve(appRoot, relativePath)
    : null

  // Delimit NODE_PATH
  const nodePath = (process.env.NODE_PATH || npmRoot)
    .split(path.delimiter)
    .filter(Boolean)

  // A hack for fix some case module.paths not includes NODE_PATH
  if (!module.paths.includes(npmRoot)) {
    module.paths = module.paths.concat(npmRoot)
  }

  // May install at ~/.fe
  // const cliRoot = path.join(require.resolve('fe/package.json'), '..')
  const cliRoot = path.join(dirname, '..', '..')

  const tmpdir = osenv.tmpdir()
  let home = osenv.home()
  const pid = process.getuid ? process.getuid() : process.pid

  // cross-platform home
  if (home) process.env.HOME = home
  else home = path.resolve(tmpdir, 'fe-' + pid)

  const platform = process.platform
  // Locate the cache dir
  // ~/.fe-cache on posix, or %AppData%/fe-cache on windows
  const cacheExtra = platform === 'win32' ? 'fe-cache' : '.fe-cache'
  const cacheRoot = path.resolve(platform === 'win32' && process.env.APPDATA || home, cacheExtra)

  const result = {
    dirname,
    cwd,
    appRoot,
    cliRoot,
    npmRoot,
    cacheRoot,
    nodePath,
    platform,
    tmpdir,
    home,
    pid,
    config,
    user: osenv.user(),
    sharedConfigPath: path.join(cliRoot, 'lib', 'config'),
    internalModulePath: path.join(cliRoot, 'node_modules'),
    VERSION: pkg.version,
    NODE_VERSION: execa.shellSync('node -v').stdout,
    NPM_VERSION: execa.shellSync('npm -v').stdout,
    WEBPACK_VERSION: (pkg.dependencies.webpack + '').replace('^', ''),
    BABEL_VERSION: (pkg.dependencies['babel-core'] + '').replace('^', ''),
    YARN_VERSION: execa.shellSync('yarn -V').stdout
  }

  keys(config).map(key => {
    if (key === 'ENTRY_FILE' && Array.isArray(config[key])) {
      result[key] = config[key].map(entry => resolveApp(entry))
    } else if (/_DIR|_FILE/.test(key)) result[key] = resolveApp(config[key])
  })

  if (customConfig.inChina === undefined) {
    config.inChina = await isInChina()
    result.FE_CONFIG_FILE && saveConfig({ inChina: config.inChina }, result.FE_CONFIG_FILE)
  }

  return result
}
