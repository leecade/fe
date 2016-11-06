import test from 'ava'
import { wait } from '../../src/utils'

test('fs utils...', async t => {
  await wait(1) && t.fail()
})

test('fs 1', async t => {
  t.pass()
})
