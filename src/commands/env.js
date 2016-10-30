import chalk from 'chalk'
export default async (cmd, env) => {
  console.log(
    JSON.stringify(env, null, 2)
      .replace(/"(.+)": /g, `${chalk.blue('$1:')} `)
      // .replace(/^{/, '')
      // .replace(/}$/, '')
      .replace(/(null)|(undefined)/g, `${chalk.red('$1')}`)
      .replace(/(,|{|}|[|]|,|")/g, `${chalk.gray('$1')}`)
  )
}
