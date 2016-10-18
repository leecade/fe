// var program = require('commander')
import path from 'path'
import commander from 'commander'
import chalk from 'chalk'
import {
  log,
  findRoot
} from './utils'
import pkg from '../package.json'
import defaultConfig from './config'

import dev from './commands/dev'
import build from './commands/build'
import init from './commands/init'
import list from './commands/list'
import generate from './commands/generate'
import deploy from './commands/deploy'
import update from './commands/update'
import upgrade from './commands/upgrade'

import start from './commands/start'

const cwdPath = path.resolve('.')
let projectRootPath = findRoot('fe.config.js', cwdPath) || findRoot('fe.config.babel.js', cwdPath)

if (!projectRootPath) {
  log.warning(`No ${chalk.magenta.underline('fe.config.js')} or ${chalk.magenta.underline('fe.config.babel.js')} found, run ${chalk.magenta.underline('fe init')} first in your project's root folder`)
  projectRootPath = cwdPath
}

const version = pkg.version

commander
  .version(version || '0.0.1')
  .description(`A modern development workflow: ${chalk.magenta.underline('fe init')} > ${chalk.magenta.underline('fe dev')} > ${chalk.magenta.underline('fe g route')}`)

// Inject more opts on commander.prototype.opts
Object.assign(commander.opts, {
  projectRootPath,
  version,
  defaultConfig
})

/*
Notice:
1. alias === command will cause the action run twice
 */
commander
  // .command('info <dir> [thing]', 'xxx')
  .command('dev')
  .description(`Enter ${chalk.yellow.underline('development')} mode, with liveload support`)
  .alias('d')
  .option('-p, --port', 'Add peppers')
  .action(dev)

commander
  // .command('info <dir> [thing]', 'xxx')
  .command('dd')
  .description(`TEST ${chalk.yellow.underline('development')} mode, with liveload support`)
  .alias('ddd')
  .option('-p, --port', 'Add peppers')
  .action(start)

commander
  .command('build')
  .description(`${chalk.green.underline('Build')} static assets with dependencies`)
  .alias('b')
  .option('-w, --watch', 'Watching mode')
  .action(build)

commander
  .command('init [ui]')
  .description(`Initiate a project with [${chalk.white.underline('empty')}|${chalk.red.underline('cms')}|${chalk.gray.underline('link')}] ui bolierplate`)
  .action(init)

commander
  .command('list')
  .description(`List the components in ${chalk.magenta.underline('fe')}-ecosystem`)
  .alias('l')
  .action(list)

commander
  .command('generate [thing]')
  .description(`Generate [${chalk.underline('component')}|${chalk.underline('route')}]`)
  .alias('g')
  .action(generate)

commander
  .command('deploy [env]')
  .description('Deploy code to spec env')
  .action(deploy)

commander
  .command('update')
  .description('Update local outdated modules')
  .alias('up')
  .action(update)

commander
  .command('upgrade')
  .description(`Upgrade ${chalk.magenta.underline('fe')} tool`)
  .action(upgrade.bind(null, version))

commander.on('--help', function () {
  console.log('  Examples:')
  console.log('')
  console.log('    $ fe dev -p 3000')
  console.log('    $ fe dev -h')
  console.log('')
})

commander.parse(process.argv)

if (!commander.args.length) commander.help()
/*
if (!process.argv.slice(2).length) {
  commander.outputHelp()
}
*/
export default commander
