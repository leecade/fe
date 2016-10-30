import chalk from 'chalk'
import historyApiFallback from 'connect-history-api-fallback'
import httpProxyMiddleware from 'http-proxy-middleware'

const onProxyError = proxy => (err, req, res) => {
  const host = req.headers && req.headers.host
  console.log(
    chalk.red('Proxy error:') + ' Could not proxy request ' + chalk.cyan(req.url) +
    ' from ' + chalk.cyan(host) + ' to ' + chalk.cyan(proxy) + '.'
  )
  console.log(
    'See https://nodejs.org/api/errors.html#errors_common_system_errors for more information (' +
    chalk.cyan(err.code) + ').'
  )
  console.log()
  if (res.writeHead && !res.headersSent) {
    res.writeHead(500)
  }
  res.end('Proxy error: Could not proxy request ' + req.url + ' from ' +
    host + ' to ' + proxy + ' (' + err.code + ').'
  )
}

export default (devServer, proxy) => {
  devServer.use(historyApiFallback({
    disableDotRule: true,
    htmlAcceptHeaders: proxy
      ? ['text/html']
      : ['text/html', '*/*']
  }))
  if (proxy) {
    const mayProxy = /^(?!\/(index\.html$|.*\.hot-update\.json$|sockjs-node\/)).*$/
    devServer.use(mayProxy,
      httpProxyMiddleware(pathname => mayProxy.test(pathname), {
        target: proxy,
        logLevel: 'silent',
        onError: onProxyError(proxy),
        secure: false,
        changeOrigin: true
      })
    )
  }
  devServer.middleware && devServer.use(devServer.middleware)
}
