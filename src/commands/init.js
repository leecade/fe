import os from 'os'
import path from 'path'
import download from 'download-git-repo'
import inquirer from 'inquirer'
import chalk from 'chalk'
import rimraf from 'rimraf'
import {
  log,
  // wait,
  Spinner
} from '../utils'
import generate from '../utils/generate'

export default async (project, defaultBoilerplate = 'basic') => {
  // if (!project) return log.error(`<project> name must be provided`)

  const { boilerplate } = await inquirer.prompt({
    type: 'input',
    name: 'boilerplate',
    message: `Choose your project boilerplate, see: ${chalk.magenta.underline(`fe list`)}`,
    default: defaultBoilerplate
  })

  // const { initGit } = await inquirer.prompt({
  //   type: 'confirm',
  //   name: 'initGit',
  //   message: 'Initialize git repository'
  // })

  // console.log(useDefault, initGit)

  const spinner = new Spinner()

  // const url = 'https://github.com/fe-boilerplate/basic/archive/master.zip'
  spinner.start({
    text: 'boilerplate downloading...'
  })

  const tempPath = `${os.tmpdir()}/fe-${+new Date()}`

  download(`fe-boilerplate/${boilerplate}`, tempPath, err => {
  // download('vuejs-templates/webpack', tempPath, err => {
    spinner.stop()
    if (err) return log.error(err)
    process.on('exit', () => rimraf.sync(tempPath))
    const to = path.resolve(project || '.')
    generate(project, tempPath, to, err => {
      if (err) log.error(err)
      console.log()
      log.success(`Generated ${chalk.blue.underline(project)}`)
    })
  })
}
