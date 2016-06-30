var program = require('commander')
// var colors = require('colors')

/*
dev
build
deploy
test
lint
 */

program
  .version('0.0.1')
  .description('An application for pizzas ordering')
  .command('install [name]', 'install one or more packages')
  .command('search [query]', 'search with optional query')
  .command('list', 'list packages installed')
  .parse(process.argv)

program.runningCommand.on('exit', function (code) {
  console.log('data from foo: ' + code)
})

// if (!program.args.length) program.help()
export default program
