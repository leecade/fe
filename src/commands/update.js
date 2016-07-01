import { run, reporters } from 'updtr'

export default (cwd, cmd) => run({
  cwd: cwd,
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
