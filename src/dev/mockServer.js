// default
import Router from 'koa-router'
import getMockRoutes from './getMockRoutes.noparse'

export default app => {
  const router = new Router()
  const routes = getMockRoutes(app.context.cwd)
  routes.map(items => {
    items.map(config => {
      const {
        method = 'get',
        route = '',
        handler = {}
      } = config

      router[method.toLowerCase()](route, typeof handler === 'function'
        ? handler
        : (ctx, next) => {
          ctx.body = handler
        }
      )
      app
        .use(router.routes())
        .use(router.allowedMethods())
    })
  })
}
