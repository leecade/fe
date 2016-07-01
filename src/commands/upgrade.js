import ora from 'ora'
import execa from 'execa'
import semver from 'semver'
import chalk from 'chalk'
import { log } from '../utils'

export const checkVersion = async version => {
  const { stdout } = await execa.shell('npm show fe version')
    .catch(log.error)
  return semver.gt(stdout, version)
    ? stdout
    : false
}

export default async (version, cmd) => {
  let spinner = ora({
    text: 'Checking for new version',
    color: 'yellow'
    // spinner: process.argv[2]
  }).start()

  const shouldUpgrade = await checkVersion(version)
  if (!shouldUpgrade) {
    spinner.stop()
    return log.success('You are using the latest version')
  }

  spinner.color = 'green'
  spinner.text = `Installing new version ${chalk.yellow(shouldUpgrade)}`
  await execa.shell('npm install fe -g')
    .catch(log.error)
  spinner.stop()
  log.success('You are using the latest version')
}
