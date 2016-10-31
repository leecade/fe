import chalk from 'chalk'
import pkg from '../package.json'
import commands from './commands/'
import updateNotifier from 'update-notifier'

const version = pkg.version

// Render logo
!~process.argv.indexOf('--version') && console.log(`
${chalk.blue('   _____ _____')}${chalk.red('        _           _')}
${chalk.blue('  |   __|   __|')}${chalk.red('   ___| |_ ___ ___| |_')}    ${chalk.dim('(> ” ” <)')}
${chalk.blue('  |   __|   __|')}${chalk.red('  |_ -|  _| . |  _| \'_|')}   ${chalk.dim('( =’o\'= )')}
${chalk.blue('  |__|  |_____|')}${chalk.red('  |___|_| |___|___|_,_|')}  ${chalk.dim(`-(,,)-(,,)-`)}${chalk.white(`v${version}`)}${chalk.dim('-')}
    `)

// Register commands
commands(pkg)

// Register update notifier
updateNotifier({
  pkg,
  updateCheckInterval: 1000 * 60 * 60 * 24 * 1 // 1 days
}).notify()
