const debug = require('debug')('all')
debug.enabled && require('time-require')
import { spawn } from 'child_process'
import updateNotifier from 'update-notifier'
import pkg from '../package.json'
import logo from './config/logo'

const version = pkg.version

export const makeArgs = (flags = []) => {
  const commands = require.resolve('./commands/')

  let cliArgs = []
  let args = []

  // Separation flag => node + cli
  flags.map(flag => {
    switch (flag) {
      // build-in debug mode
      case '-d':
      case '--debug':
        args.unshift('--debug-brk')
        args.unshift('--inspect')
        break
      case 'debug':
      case '--debug-brk':
      case '--inspect':
        args.unshift(flag)
        break
      case '-gc':
      case '--expose-gc':
        args.unshift('--expose-gc')
        break
      case '--gc-global':
      case '--es_staging':
      case '--no-deprecation':
      case '--prof':
      case '--log-timer-events':
      case '--throw-deprecation':
      case '--trace-deprecation':
      case '--use_strict':
      case '--allow-natives-syntax':
      case '--perf-basic-prof':
        args.unshift(flag)
        break
      // default:
      //   if (arg.indexOf('--harmony') === 0) {
      //     args.unshift(arg)
      //   } else if (arg.indexOf('--trace') === 0) {
      //     args.unshift(arg)
      //   } else if (arg.indexOf('--icu-data-dir') === 0) {
      //     args.unshift(arg)
      //   } else if (arg.indexOf('--max-old-space-size') === 0) {
      //     args.unshift(arg)
      //   } else if (arg.indexOf('--preserve-symlinks') === 0) {
      //     args.unshift(arg)
      //   } else {
      //     args.push(arg)
      //   }
      //   break
      default:
        cliArgs.unshift(flag)
        break
    }
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

export default (argv = process.argv) => {
  const args = makeArgs(argv.slice(2))

  // Register commands
  invokeCommands(argv[0] || process.execPath || 'node' || 'nodejs', args)

  // Register update notifier
  updateNotifier({
    pkg,
    updateCheckInterval: 1000 * 60 * 60 * 24 * 1 // 1 days
  }).notify()

  return ~argv.indexOf('--version')
    ? ''
    : logo.replace('{version}', version)
}
