import path from 'path'
import Metalsmith from 'metalsmith'
import Handlebars from 'handlebars'
import async from 'async'
import consolidate from 'consolidate'
import minimatch from 'minimatch'
import evaluate from './eval'
import ask from './ask'
import getOptions from './getOptions'

const filter = (files, filters, data, done) => {
  if (!filters) {
    return done()
  }
  const fileNames = Object.keys(files)
  Object.keys(filters).forEach(glob => {
    fileNames.forEach(file => {
      if (minimatch(file, glob, { dot: true })) {
        const condition = filters[glob]
        if (!evaluate(condition, data)) {
          delete files[file]
        }
      }
    })
  })
  done()
}

const render = consolidate.handlebars.render

// register handlebars helper
Handlebars.registerHelper('if_eq', function (a, b, opts) {
  return a === b
    ? opts.fn(this)
    : opts.inverse(this)
})

Handlebars.registerHelper('unless_eq', function (a, b, opts) {
  return a === b
    ? opts.inverse(this)
    : opts.fn(this)
})

/**
 * Generate a template given a `src` and `dest`.
 *
 * @param {String} name
 * @param {String} src
 * @param {String} dest
 * @param {Function} done
 */

module.exports = function generate (name, src, dest, done) {
  var opts = getOptions(name, src)
  var metalsmith = Metalsmith(path.join(src, 'boilerplate'))
  var data = Object.assign(metalsmith.metadata(), {
    destDirName: name,
    inPlace: dest === process.cwd(),
    noEscape: true
  })
  opts.helpers && Object.keys(opts.helpers).map(function (key) {
    Handlebars.registerHelper(key, opts.helpers[key])
  })
  metalsmith
    .use(askQuestions(opts.prompts))
    .use(filterFiles(opts.filters))
    .use(renderTemplateFiles)
    .clean(false)
    .source('.') // start from template root instead of `./src` which is Metalsmith's default for `source`
    .destination(dest)
    .build(function (err) {
      done(err)
      logMessage(opts.completeMessage, data)
    })

  return data
}

/**
 * Create a middleware for asking questions.
 *
 * @param {Object} prompts
 * @return {Function}
 */

function askQuestions (prompts) {
  return function (files, metalsmith, done) {
    ask(prompts, metalsmith.metadata(), done)
  }
}

/**
 * Create a middleware for filtering files.
 *
 * @param {Object} filters
 * @return {Function}
 */

function filterFiles (filters) {
  return function (files, metalsmith, done) {
    filter(files, filters, metalsmith.metadata(), done)
  }
}

/**
 * Template in place plugin.
 *
 * @param {Object} files
 * @param {Metalsmith} metalsmith
 * @param {Function} done
 */

function renderTemplateFiles (files, metalsmith, done) {
  var keys = Object.keys(files)
  var metalsmithMetadata = metalsmith.metadata()
  async.each(keys, function (file, next) {
    var str = files[file].contents.toString()
    // do not attempt to render files that do not have mustaches
    if (!/{{([^{}]+)}}/g.test(str)) {
      return next()
    }
    render(str, metalsmithMetadata, function (err, res) {
      if (err) return next(err)
      files[file].contents = new Buffer(res)
      next()
    })
  }, done)
}

/**
 * Display template complete message.
 *
 * @param {String} message
 * @param {Object} data
 */

function logMessage (message, data) {
  if (!message) return
  render(message, data, function (err, res) {
    if (err) {
      console.error('\n   Error when rendering template complete message: ' + err.message.trim())
    } else {
      console.log('\n' + res.split(/\r?\n/g).map(function (line) {
        return '   ' + line
      }).join('\n'))
    }
  })
}
