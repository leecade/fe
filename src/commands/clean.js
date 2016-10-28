import rimraf from 'rimraf'
import chalk from 'chalk'
import getPaths from '../config/getPaths'
import {
  log,
  // wait,
  Spinner
} from '../utils'

const spinner = new Spinner()

export default (cmd) => {
  const { projectRootPath } = cmd.opts
  const paths = getPaths(projectRootPath)
  spinner.start('cleanning', {
    text: `cleanning build path: ${chalk.magenta.underline(paths.appBuild)}`
  })
  rimraf.sync(paths.appBuild + '/*')
  spinner.stop()
  log.success(`Clean ${chalk.magenta.underline(paths.appBuild)} successfully!`)
}
