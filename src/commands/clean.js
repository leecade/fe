import chalk from 'chalk'
import { rm } from '../utils/fs'
import {
  log,
  // wait,
  Spinner
} from '../utils'

const spinner = new Spinner()

export default async (cmd, { config, appRoot, BUILD_DIR }) => {
  if (!appRoot) {
    return log.warning(`No ${chalk.red.underline(config.FE_CONFIG_FILE)} found, make sure ${chalk.blue.underline('cd [project folder]')} or create your project through ${chalk.blue.underline('fe init <project> [boilerplate]')}`)
  }
  if (!BUILD_DIR) {
    return log.warning(`Skipped, No ${chalk.red.underline(config.BUILD_DIR)} folder found`)
  }
  spinner.start('cleanning', {
    text: `cleanning : ${chalk.cyan.underline(BUILD_DIR)}`
  })
  await rm(BUILD_DIR + '/*')
  spinner.stop()
  log.success(`Cleaned ${chalk.cyan.underline(BUILD_DIR)}`)
}
