import { join } from 'path'
import test from 'ava'
import osenv from 'osenv'
import { exists, touchp, rm } from '../../src/utils/fs'
import clean from '../../src/commands/clean'

const tempDir = join(osenv.tmpdir(), 'tempDir')
const buildDir = join(tempDir, 'build')
const tempFile = join(buildDir, 'tempFile')
const config = {
  FE_CONFIG_FILE: 'FE_CONFIG_FILE',
  BUILD_DIR: buildDir
}

test.before(async t => {
  await touchp(tempFile)
})

test('Faild if no appRoot spec', async t => {
  await clean(null, { config, BUILD_DIR: buildDir })
  t.true(await exists(tempFile))
})

test('Faild if no BUILD_DIR spec', async t => {
  await clean(null, { config, appRoot: tempDir })
  t.true(await exists(tempFile))
})

test('clean build success', async t => {
  await clean(null, { config, appRoot: tempDir, BUILD_DIR: buildDir })
  t.true(!await exists(tempFile))
  t.true(await exists(buildDir))
})

test.after(async t => {
  await rm(tempDir)
})
