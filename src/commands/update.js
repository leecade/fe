import chalk from 'chalk'
import { run, reporters } from 'updtr'
import {
  log
} from '../utils'

export default (cmd, { appRoot, config }) => {
  if (!appRoot) {
    return log.warning(`No ${chalk.red.underline(config.FE_CONFIG_FILE)} found, make sure ${chalk.blue.underline('cd [project folder]')} or create your project through ${chalk.blue.underline('fe init <project> [boilerplate]')}`)
  }
  run({
    cwd: appRoot,
    reporter: reporters.default
    // wanted: commander.wanted,
    // testCmd: commander.test,
    // exclude: commander.exclude,
    // testStdout: commander.testStdout,
    // saveExact: commander.saveExact,
    // registry: commander.registry
  }, err => {
    // err && err.code > 1 && log.error(err)
    if (err && err.code > 1) throw err
  })
}
