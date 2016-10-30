// default
// import Router from 'koa-router'
// import historyApiFallback from 'connect-history-api-fallback'
import getMockRoutes from './getMockRoutes.noparse'

export default (devServer, { appRoot, config }) => {
  // const router = new Router()
  // const router = Router()

  // const routes = getMockRoutes(devServer.context.cwd)
  const routes = getMockRoutes(appRoot)
  routes.map(items => {
    items.map(conf => {
      const {
        method = 'get',
        route = '',
        handler = {}
      } = conf

      devServer[method.toLowerCase()](config.MOCK_PREFIX + route, typeof handler === 'function'
        ? handler
        : (req, res) => {
          res.send(handler)
        })
    })
  })
}
