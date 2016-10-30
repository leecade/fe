import { execSync } from 'child_process'
import opn from 'opn'
export default url => {
  if (process.platform === 'darwin') {
    try {
      // Try our best to reuse existing tab
      // on OS X Google Chrome with AppleScript
      execSync('ps cax | grep "Google Chrome"')
      execSync(
        'osascript openChrome.applescript ' + url,
        {cwd: __dirname, stdio: 'ignore'}
      )
      return true
    } catch (err) {
      // Ignore errors.
    }
  }
  // Fallback to opn
  // (It will always open new tab)
  try {
    opn(url)
    return true
  } catch (err) {
    return false
  }
}
