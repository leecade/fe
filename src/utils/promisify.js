/**
 * Promisify a callback-style function
 * @param  {Function} fn original function
 * @opts  {Object} opts options
 * @opts  {Object} opts.context context
 * @opts  {Bool} opts.multiArgs Should multiple arguments be returned
 * @return {Function}      A promisified version of original function
 */
export default (fn, opts = {}) =>
  (...args) =>
    new Promise((resolve, reject) => {
      args.push((err, ...values) => {
        if (err) return reject(err)
        resolve(opts.multiArgs ? values : values[0])
      })
      const response = fn.apply(opts.context === undefined ? this : opts.context, args)
      response &&
        typeof response.then === 'function' &&
        response.catch === 'function' &&
        resolve(response)
    })
