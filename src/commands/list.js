// import request from 'request'
import chalk from 'chalk'
const request = require('request')
import {
  log,
  // wait,
  Spinner
} from '../utils'

// Planning to use github group to store list
const list = [{
  name: 'components',
  usage: 'npm i [name] -S',
  url: 'https://api.github.com/users/fe-components/repos'
}, {
  name: 'templates',
  usage: 'fe init [name]',
  url: 'https://api.github.com/users/fe-templates/repos'
}]

const spinner = new Spinner()

const reporter = body => {
  // console.log()
  // console.log('')
  log.info(`Available official ${body.reporter_name} (usage: ${chalk.magenta.underline(body.reporter_usage)}):`)
  console.log()
  body.forEach(function (repo) {
    console.log(`  ${chalk.yellow('★')}  ${chalk.blue(repo.name)} - ${repo.description || ''}`)
  })
}

const fetchList = list => new Promise((resolve, reject) => {
  request({
    url: list.url,
    headers: {
      'User-Agent': 'fe'
    }
  }, (err, res, body) => {
    if (err) return reject(err)
    try {
      resolve(Object.assign(JSON.parse(body), {
        reporter_name: list.name,
        reporter_usage: list.usage
      }))
    } catch (err) {
      reject(body)
    }
  })
})

export default async () => {
  let promises = list.map(item => fetchList(item))
  spinner.start({
    text: 'fetching...'
  })
  let results = await Promise.all(promises)
    .catch(err => log.error(err))
  spinner.stop()
  results.map(reporter)
}
