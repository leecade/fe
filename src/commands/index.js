// import path from 'path'
import { Command } from 'commander'
import chalk from 'chalk'

export default pkg => {
  Command.prototype.inject = function (command) {
    return this.action(async function (...arg) {
      const env = await require('../runtime/').default(pkg)
      require(`./${command}`).default.apply(this, arg.concat(env))
    })
  }

  const commander = new Command()

  commander
    .version(pkg.version)
    .description(`A modern development workflow: ${chalk.blue.underline('fe init')} > ${chalk.blue.underline('fe dev')} > ${chalk.blue.underline('fe g route')} > ${chalk.blue.underline('fe build')}`)

  // Inject more opts on commander.prototype.opts
  // Object.assign(commander.opts, {
  //   projectRootPath,
  //   version,
  //   defaultConfig
  // })

  /*
  Notice:
  1. alias === command will cause the action run twice
   */
  commander
    .command('dev')
    .description(`Enter ${chalk.yellow.underline('development')} mode, with liveload support`)
    .alias('d')
    .option('-p, --port', 'Add peppers')
    .inject('dev')

  commander
    .command('clean')
    .description(`Clean build folder`)
    .alias('c')
    .inject('clean')

  commander
    .command('build')
    .description(`${chalk.green.underline('Compile')} and compress static assets`)
    .alias('b')
    .option('-w, --watch', 'Watching mode')
    .inject('build')

  commander
    .command('init <project> [boilerplate]')
    .description(`Initiate a project with the provided bolierplates`)
    .alias('i')
    .option('-s, --stock', 'Base on stock')
    .inject('init')

  commander
    .command('list')
    .description(`List the components and boilerplates in ${chalk.blue.underline('fe-stack')}`)
    .alias('l')
    .inject('list')

  commander
    .command('generate [thing]')
    .description(`Generate [${chalk.underline('component')}|${chalk.underline('route')}]`)
    .alias('g')
    .inject('generate')

  commander
    .command('deploy [env]')
    .description('Deploy code to spec env')
    .alias('D')
    .inject('deploy')

  commander
    .command('env')
    .description('Show usefully runtime ENV')
    .alias('e')
    .inject('env')

  commander
    .command('update')
    .description('Update local outdated modules')
    .alias('u')
    .inject('update')

  commander
    .command('upgrade')
    .description(`Upgrade ${chalk.blue.underline('fe')} tool`)
    .alias('U')
    .inject('upgrade')

  commander.on('--help', function () {
    console.log('  Examples:')
    console.log('')
    console.log('    $ fe dev -p 3000')
    console.log('    $ fe dev -h')
    console.log('')
  })

  // Add default behavior `-v` = `-V`
  const vPos = process.argv.indexOf('-v')
  if (vPos > -1) {
    process.argv[vPos] = '-V'
  }

  commander.parse(process.argv)

  if (!commander.args.length) commander.help()
  /*
  if (!process.argv.slice(2).length) {
    commander.outputHelp()
  }
  */
}
