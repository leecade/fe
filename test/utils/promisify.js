import test from 'ava'
import promisify from '../../src/utils/promisify'

const fixture = cb => cb()
const fixture2 = (arg, cb) => cb(null, arg)
const fixture3 = cb => cb(null, 'hi', 'world')
const fixture4 = cb => cb('err')

test('return value should implement promise interface', async t => {
  const response = promisify(fixture)()
  t.truthy(response)
  t.is(typeof response.then, 'function')
  t.is(typeof response.catch, 'function')
})

test('pass argument', async t => {
  t.is(await promisify(fixture2)('hi'), 'hi')
})

test('pass multi-arguments', async t => {
  t.deepEqual(await promisify(fixture3, { multiArgs: true })(), ['hi', 'world'])
})

test('pass multi-arguments', async t => {
  t.deepEqual(await promisify(fixture3, { multiArgs: true })(), ['hi', 'world'])
})

test('catch error', async t => {
  await promisify(fixture4)()
    .catch(err => t.is(err, 'err'))
})

test('with context', async function (t) {
  const context = this
  await promisify(function (cb) {
    t.is(context, this)
    cb(null)
  }, {
    context: context
  })()
})

