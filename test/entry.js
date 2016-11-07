import test from 'ava'
// import path from 'path'
import entry, { makeArgs, supportNodeParams } from '../src/'
import { version } from '../package.json'
import logo from '../src/config/logo'
const commandsEntry = require.resolve('../src/commands/')

test('Should render logo with empty argument', async t => {
  t.is(entry([], 'babel-node'), logo.replace('{version}', version))
})

test('Should hide logo with --version', async t => {
  t.is(entry([process.env.NODE, require.resolve('../bin/fe.js'), '--version'], 'babel-node'), '')
})

test('Should preserve terminal color', async t => {
  t.true(!!~makeArgs().indexOf('--color'))
})

test('Should handle cli params correctly', async t => {
  const fixture = [
    commandsEntry,
    '--color',
    'dev',
    '-h'
  ]
  t.deepEqual(makeArgs(['dev', '-h']), fixture)
})

test('Should handle node params correctly', async t => {
  const fixture = [
    '--inspect',
    commandsEntry,
    '--color',
    'dev',
    '-h'
  ]
  t.deepEqual(makeArgs(['--inspect', 'dev', '-h']), fixture)
})

test('Should recognize node or cli params correctly', async t => {
  const fixture = [
    commandsEntry,
    '--color',
    'dev',
    '-h',
    '-d'
  ]
  t.deepEqual(makeArgs(['dev', '-h', '-d']), fixture)
})

test('Should handle node alias', async t => {
  const fixture = [
    '--inspect',
    '--debug-brk',
    commandsEntry,
    '--color',
    'dev',
    '-h'
  ]
  t.deepEqual(makeArgs(['-d', 'dev', '-h']), fixture)
  const fixture2 = [
    '--expose-gc',
    commandsEntry,
    '--color',
    'dev',
    '-h'
  ]
  t.deepEqual(makeArgs(['-gc', 'dev', '-h']), fixture2)
})

test('Cover all support node params', async t => {
  supportNodeParams.map(param => {
    const fixture = [
      param,
      commandsEntry,
      '--color',
      'dev',
      '-h'
    ]
    t.deepEqual(makeArgs([param, 'dev', '-h']), fixture)
  })
})

test.todo('TODO: more cli arguments check')
