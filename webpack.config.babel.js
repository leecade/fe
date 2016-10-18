import path from 'path'
import fs from 'fs'
// import webpack from 'webpack'
const rootPath = __dirname
const srcPath = path.join(rootPath, 'src')
const distPath = path.join(rootPath, 'lib')
const modulesPath = path.join(rootPath, 'node_modules')

let nodeModules = {}
fs.readdirSync(modulesPath)
  .filter(x => ['.bin'].indexOf(x) === -1)
  .forEach(mod => (nodeModules[mod] = 'commonjs ' + mod))

let exportConfigs = {}

fs.readdirSync('./src/config/')
  .filter(file => file.match(/.*\.js$/))
  .map(file => (exportConfigs[`config/${file.replace(/\.js$/, '')}`] = `${srcPath}/config/${file}`))

export default {
  target: 'node',
  cache: true,
  context: srcPath,
  node: {
    __filename: false,
    __dirname: false
  },
  entry: Object.assign({}, exportConfigs, {
    'index': ['babel-polyfill', path.join(srcPath, 'index.js')]
  }),
  output: {
    path: distPath,
    filename: '[name].js',
    // publicPath: 'http://localhost:3000/static/'
    publicPath: ''
    // publicPath: `http://localhost:${port}/`
  },
  plugins: [
    /*
    new webpack.optimize.UglifyJsPlugin({
      compressor: {
        warnings: false
        // remove `console.*`
      },
      output: {
        comments: false
      }
    })
    */
  ],
  stats: {
    // Nice colored output
    colors: true
  },
  module: {
    loaders: [{
      test: /\.json$/,
      loader: 'json'
    }, {
      test: /\.jsx?$/,
      loader: 'babel',
      query: {
        cacheDirectory: true
      },
      include: srcPath
    }],
    noParse: [
      // allow some js include dynamic require
      // webpack(2.1.beta) not support dynamic require yet
      // like: getMockRoutes
      /\.noparse\.jsx?/
      // 'request/index.js'
      // 'react/dist/react.js',
      // 'react-dom/dist/react-dom.js'
    ],

    // disable Critical dependency warnning
    exprContextCritical: false
  },

  resolve: {
    // require('file') => require('file.coffee')
    extensions: ['.js', '.jsx', '.json', '.coffee'],

    // optimize jquery
    alias: {
    }
  },

  externals: nodeModules
}
