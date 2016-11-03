import { spawn } from 'child_process'

/**
 * [description]
 * @param  {[type]} cliPath [description]
 * @param  {Array}  args    [description]
 * @param  {Object} opts    [description]
 * @return {[type]}         [description]
 */
export default async (cliPath, args = [], opts = {}) => {
  let proc
  let stdout
  let stderr
  await Promise.all([
    new Promise((resolve, reject) => (proc = spawn(process.execPath || 'node' || 'nodejs', [cliPath].concat(args), Object.assign({
      cwd: __dirname,
      stdio: [null, 'pipe', 'pipe']
    }, opts))
    .on('close', (code, signal) => {
      if (code) {
        const err = new Error('test-worker exited with a non-zero exit code: ' + code)
        err.code = code
        err.signal = signal
        return resolve(err)
      }
      resolve(code)
    }))),
    new Promise((resolve, reject) => proc.stdout
      .on('data', data => (stdout += data))
      .on('end', resolve)
      .once('error', reject)),
    new Promise((resolve, reject) => proc.stderr
      .on('data', data => (stderr += data))
      .on('end', resolve)
      .once('error', reject))
  ])
  return {
    proc,
    stdout,
    stderr
  }
}
