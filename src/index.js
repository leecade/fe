const debug = require('debug')('fe')
debug.enabled && require('time-require')
import { spawn } from 'child_process'
import updateNotifier from 'update-notifier'
import pkg from '../package.json'
import logo from './config/logo'

const version = pkg.version

export const supportNodeParams = [
  '--debug-brk',
  '--inspect',
  '--expose-gc',
  '--gc-global',
  '--es_staging',
  '--no-deprecation',
  '--prof',
  '--log-timer-events',
  '--throw-deprecation',
  '--trace-deprecation',
  '--use_strict',
  '--allow-natives-syntax',
  '--perf-basic-prof',
  '--harmony',
  '--trace',
  '--icu-data-dir',
  '--max-old-space-size',
  '--preserve-symlinks'
]

export const makeArgs = (flags = []) => {
  const commands = require.resolve('./commands/')

  let cliArgs = []
  let args = []
  let commandPos

  flags.some((flag, i) => {
    if (!~flag.indexOf(/^-/)) {
      commandPos = i
      return true
    }
  })

  // Separation flag => node + cli
  flags.forEach((flag, i) => {
    if (i <= commandPos) {
      // Respect node params
      if (~supportNodeParams.indexOf(flag)) return args.unshift(flag)
      if (flag === '-gc') return args.unshift('--expose-gc')
      if (flag === '-d' || flag === '--debug') {
        args.unshift('--debug-brk')
        args.unshift('--inspect')
        return
      }
    }
    cliArgs.push(flag)
  })

  args.push(commands)

  // preserve terminal color
  args.push('--color')
  args = args.concat(cliArgs)
  return args
}

const invokeCommands = (execPath, args) => {
  // const proc = spawn(process.execPath || 'node' || 'nodejs', args, { stdio: 'inherit' })
  const proc = spawn(execPath, args)

  proc.stdout.on('data', (data) => {
    process.stdout.write(data)
  })

  proc.stderr.on('data', (data) => {
    const str = data.toString()
    // let url = ((str).match(/(chrome-devtools:\/\/[^\s]*)/) || [])[0]
    // TODO: BUG
    // only copy-paste work
    // url && openBrowser(url)

    process.stderr.write(str.replace('Warning: This is an experimental feature and could change at any time.', ''))
  })

  proc.on('exit', (code, signal) => process.on('exit', () => {
    if (signal) {
      process.kill(process.pid, signal)
    } else {
      process.exit(code)
    }
  }))

  // terminate children.
  process.on('SIGINT', () => {
    proc.kill('SIGINT') // calls runner.abort()
    proc.kill('SIGTERM') // if that didn't work, we're probably in an infinite loop, so make it die.
  })
}

export default (argv = process.argv, execPath = process.execPath) => {
  const args = makeArgs(argv.slice(2))

  // Register commands
  // use `babel-node` as execPath in test environment
  invokeCommands(execPath || argv[0] || 'node' || 'nodejs', args)

  // Register update notifier
  updateNotifier({
    pkg,
    updateCheckInterval: 1000 * 60 * 60 * 24 * 1 // 1 days
  }).notify()

  return ~argv.indexOf('--version')
    ? ''
    : logo.replace('{version}', version)
}
