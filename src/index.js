const debug = require('debug')('all')
debug.enabled && require('time-require')
import { spawn } from 'child_process'
import chalk from 'chalk'
import updateNotifier from 'update-notifier'
import pkg from '../package.json'

const version = pkg.version

export default () => {
  // Render logo
  !~process.argv.indexOf('--version') && console.log(`
  ${chalk.blue('   _____ _____')}${chalk.red('        _           _')}
  ${chalk.blue('  |   __|   __|')}${chalk.red('   ___| |_ ___ ___| |_')}    ${chalk.dim('(> ” ” <)')}
  ${chalk.blue('  |   __|   __|')}${chalk.red('  |_ -|  _| . |  _| \'_|')}   ${chalk.dim('( =’o\'= )')}
  ${chalk.blue('  |__|  |_____|')}${chalk.red('  |___|_| |___|___|_,_|')}  ${chalk.dim(`-(,,)-(,,)-`)}${chalk.white(`v${version}`)}${chalk.dim('-')}
      `)

  const flags = process.argv.slice(2)
  const commands = require.resolve('./commands/')

  let cliArgs = []
  let args = []

  // TODO
  // fe -v -- --inspect
  // const divIndex = flags.indexOf('--')
  /*
  if (divIndex === -1) {
    // cmd = flags[0]
    args = []
    cliArgs = flags.slice(1)
  } else {
    // cmd = flags[divIndex + 1]
    args = flags.slice(0, divIndex)
    cliArgs = flags.slice(divIndex + 2)
  }
  */

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

  // Register commands
  // const proc = spawn(process.execPath || 'node' || 'nodejs', args, { stdio: 'inherit' })
  const proc = spawn(process.execPath || 'node' || 'nodejs', args)

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

  proc.on('exit', function (code, signal) {
    process.on('exit', function () {
      if (signal) {
        process.kill(process.pid, signal)
      } else {
        process.exit(code)
      }
    })
  })

  // terminate children.
  process.on('SIGINT', function () {
    proc.kill('SIGINT') // calls runner.abort()
    proc.kill('SIGTERM') // if that didn't work, we're probably in an infinite loop, so make it die.
  })

  // Register update notifier
  updateNotifier({
    pkg,
    updateCheckInterval: 1000 * 60 * 60 * 24 * 1 // 1 days
  }).notify()
}
