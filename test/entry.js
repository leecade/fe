import test from 'ava'
// import path from 'path'

import init from '../lib'

test('Basic assert', async t => {
  const a = /foo/
  const b = 'bar'
  const c = 'baz'
  t.true(a.test(b) || b === c)
})

test('Entry', async t => {
  t.pass(init())
})

// test.todo('will think about writing this later')
