import { log, wait } from '../utils'
import ora from 'ora'

let spinner = ora({
  text: 'Init building may take more time, please be patient',
  color: 'yellow'
  // spinner: process.argv[2]
})

const clear = () => {
  process.stderr.clearLine()
  process.stderr.cursorTo(0)
}

export default async () => {
  spinner.start()
  await wait(2)
  spinner.stop()
  // process.stdout.write('\u001b[?25l')
  log.success('open: http://127.0.0.1:3000')
  await wait(2)
  clear()
  spinner.start()
  await wait(1)
  spinner.stop()
  log.success('open: http://127.0.0.1:3000')
}
