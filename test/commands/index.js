import test from 'ava'

test('commands', async t => {
  t.notThrows(() => require('../../src/commands/'))
})
