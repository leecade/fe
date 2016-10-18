module.exports = [{
  method: 'GET',
  route: '/task-list',
  handler: require('./task-list.json')
}, {
  method: 'GET',

  // test:
  // http://localhost:3001/task?id=123&callback=cb
  route: '/task',
  handler: (req, res) => res.jsonp({
    code: 1,
    data: {
      query: req.query
    }
  })
}, {
  method: 'GET',

  // test:
  // http://localhost:3001/task/123
  // http://localhost:3001/task/123?callback=cb
  route: '/task/:id',
  handler: (req, res) => res.jsonp({
    code: 1,
    data: {
      params: req.params
    }
  })
}, {
  method: 'POST',
  route: '/new-task',
  handler: (req, res) => res.json({
    code: 1,
    msg: 'success'
  })
}]
