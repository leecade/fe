import { run, reporters } from 'updtr'

export default cmd => run({
  cwd: cmd.opts.projectRootPath,
  reporter: reporters.default
  // wanted: commander.wanted,
  // testCmd: commander.test,
  // exclude: commander.exclude,
  // testStdout: commander.testStdout,
  // saveExact: commander.saveExact,
  // registry: commander.registry
}, err => {
  if (err) throw err
})
