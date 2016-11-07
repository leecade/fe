import test from 'ava'
import path from 'path'
import runner from './helpers/runner'

const cliPath = path.resolve('../bin/fe.js')

test('Ensure cli run correctly without basicy syntax errors', async t => {
  t.notThrows(() => require('../bin/fe.js'))
})

test('Should load the entry file correctly', async t => {
  const { stdout, stderr } = await runner(cliPath)
  t.regex(stdout, /Commands/)
  t.falsy(stderr)
})

// DEBUG:fe fe -v
test('Should supports DEBUG mode', async t => {
  const { stdout, stderr } = await runner(cliPath, [], {
    env: {
      DEBUG: 'fe'
    }
  })
  t.regex(stdout, /Start time:/)
  t.falsy(stderr)
})
