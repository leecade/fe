import Koa from 'koa'
import bodyParser from 'koa-bodyparser'
import jsonp from 'koa-jsonp'
import cors from 'kcors'
// import cors from 'koa-cors'
import logger from 'koa-logger'

const app = new Koa()
app.proxy = true
app.use(logger())

// TODO: wait for this: https://github.com/koajs/cors/pull/20
app.use((ctx, next) => {
  ctx.set('Access-Control-Allow-Origin', '*')
  ctx.set('Access-Control-Allow-Methods', 'GET,HEAD,PUT,POST,DELETE')
  ctx.set('Access-Control-Allow-Credentials', 'true')
  return next()
})
app.use(cors({
  origin: '*'
}))
app.use(jsonp())
app.use(bodyParser({
  onerror: (err, ctx) => {
    console.log(err)
    ctx.throw('body parse error', 422)
  }
}))

export default app
