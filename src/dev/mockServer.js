// default
// import Router from 'koa-router'
import getMockRoutes from './getMockRoutes.noparse'

export default (app, appRoot) => {
  // const router = new Router()
  // const router = Router()

  // const routes = getMockRoutes(app.context.cwd)
  const routes = getMockRoutes(appRoot)
  routes.map(items => {
    items.map(config => {
      const {
        method = 'get',
        route = '',
        handler = {}
      } = config

      app[method.toLowerCase()](route, typeof handler === 'function'
        ? handler
        : (req, res) => {
          res.send(handler)
        })

/*
      admin.get('/', function (req, res) {
        console.log(admin.mountpath); // [ '/adm*n', '/manager' ]
        res.send('Admin Homepage');
      });
      router[method.toLowerCase()](route, typeof handler === 'function'
        ? handler
        : (ctx, next) => {
          ctx.body = handler
        }
      )
      app
        .use(router.routes())
        .use(router.allowedMethods())
*/
    })
  })
}
