module.exports = [{
  method: 'GET',
  route: '/task-list',
  handler: require('./task-list.json')
}, {
  method: 'GET',

  // test:
  // http://localhost:3001/task?id=123&callback=cb
  route: '/task',
  handler: ctx => {
    ctx.body = {
      code: 1,
      data: {
        query: ctx.query
      }
    }
  }
}, {
  method: 'GET',

  // test:
  // http://localhost:3001/task/123
  // http://localhost:3001/task/123?callback=cb
  route: '/task/:id',
  handler: ctx => {
    ctx.body = {
      code: 1,
      data: {
        params: ctx.params
      }
    }
  }
}, {
  method: 'POST',
  route: '/new-task',
  handler: ctx => {
    ctx.body = {
      code: 1,
      msg: 'success'
    }
  }
}]
