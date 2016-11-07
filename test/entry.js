import test from 'ava'
// import path from 'path'
import entry, { makeArgs } from '../lib/'
import { version } from '../package.json'
import logo from '../src/config/logo'

test('render logo with empty argument', async t => {
  t.is(entry(), logo.replace('{version}', version))
})

test('hide logo with --version', async t => {
  t.is(entry([process.env.NODE, require.resolve('../bin/fe.js'), '--version']), '')
})

test('default preserve color', async t => {
  t.true(makeArgs().includes('--color'))
})

test.todo('TODO: more cli arguments check')
