import test from 'ava'
import path from 'path'
import runner from './helpers/runner'

const cliPath = path.resolve('../bin/fe.js')

test('Should correct load the entry file', async t => {
  const { stderr } = await runner(cliPath)
  // t.pass(stdout)
  stderr && t.fail(stderr)
})

test.todo('TODO: cross-platform test')
