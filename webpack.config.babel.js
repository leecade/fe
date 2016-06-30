import path from 'path'
import fs from 'fs'
const rootPath = __dirname
const srcPath = path.join(rootPath, 'src')
const distPath = path.join(rootPath, 'lib')
const modulesPath = path.join(rootPath, 'node_modules')

let nodeModules = {}
fs.readdirSync(modulesPath)
  .filter(x => ['.bin'].indexOf(x) === -1)
  .forEach(mod => (nodeModules[mod] = 'commonjs ' + mod))

export default {
  target: 'node',
  cache: true,
  context: srcPath,
  node: {
    __filename: false,
    __dirname: false
  },
  entry: {
    'index': [path.join(srcPath, 'index.js')]
  },
  output: {
    path: distPath,
    filename: '[name].js',
    // publicPath: 'http://localhost:3000/static/'
    publicPath: ''
    // publicPath: `http://localhost:${port}/`
  },
  plugins: [
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
      // 'react/dist/react.js',
      // 'react-dom/dist/react-dom.js'
    ]
  },

  resolve: {
    // require('file') => require('file.coffee')
    extensions: ['', '.js', '.jsx', '.json', '.coffee'],

    // optimize jquery
    alias: {
    }
  },

  externals: nodeModules
}
