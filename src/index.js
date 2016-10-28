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

import clearConsole from './utils/clearConsole'

import dev from './commands/dev'
import clean from './commands/clean'
import build from './commands/build'
import init from './commands/init'
import list from './commands/list'
import generate from './commands/generate'
import deploy from './commands/deploy'
import update from './commands/update'
import upgrade from './commands/upgrade'

const version = pkg.version

clearConsole()
console.log(`
${chalk.blue('   _____ _____')}${chalk.gray('        _           _')}
${chalk.blue('  |   __|   __|')}${chalk.gray('   ___| |_ ___ ___| |_')}    ${chalk.black('(> ” ” <)')}
${chalk.blue('  |   __|   __|')}${chalk.gray('  |_ -|  _| . |  _| \'_|')}   ${chalk.black('( =’o\'= )')}
${chalk.blue('  |__|  |_____|')}${chalk.gray('  |___|_| |___|___|_,_|')}  ${chalk.black(`-(,,)-(,,)-${chalk.white(`v${version}`)}-`)}
    `)

const cwdPath = path.resolve('.')
let projectRootPath = findRoot('fe.config.js', cwdPath) || findRoot('fe.config.babel.js', cwdPath)

if (!projectRootPath) {
  log.warning(`No ${chalk.blue.underline('fe.config.js')} found, run ${chalk.blue.underline('fe init')} first to create your project`)
  projectRootPath = cwdPath
}

commander
  .version(version || '0.0.1')
  .description(`A modern development workflow: ${chalk.blue.underline('fe init')} > ${chalk.blue.underline('fe dev')} > ${chalk.blue.underline('fe g route')} > ${chalk.blue.underline('fe build')}`)

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
  .command('clean')
  .description(`Clean build folder`)
  .alias('c')
  .action(clean)

commander
  .command('build')
  .description(`${chalk.green.underline('Compile')} and compress static assets for deploy`)
  .alias('b')
  .option('-w, --watch', 'Watching mode')
  .action(build)

commander
  .command('init <project> [boilerplate]')
  .description(`Initiate a project with the provided bolierplates`)
  .alias('i')
  .option('-s, --stock', 'Base on stock')
  .action(init)

commander
  .command('list')
  .description(`List the components and boilerplates in ${chalk.blue.underline('fe-stack')}`)
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
  .description(`Upgrade ${chalk.blue.underline('fe')} tool`)
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
