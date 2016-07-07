/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.l = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// identity function for calling harmory imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };

/******/ 	// define getter function for harmory exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		Object.defineProperty(exports, name, {
/******/ 			configurable: false,
/******/ 			enumerable: true,
/******/ 			get: getter
/******/ 		});
/******/ 	};

/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 33);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ListenerManager = exports.getSubDirs = exports.findRoot = exports.pathExists = exports.wait = exports.log = exports.Spinner = undefined;

var _fs = __webpack_require__(22);

var _fs2 = _interopRequireDefault(_fs);

var _path = __webpack_require__(2);

var _path2 = _interopRequireDefault(_path);

var _chalk = __webpack_require__(1);

var _chalk2 = _interopRequireDefault(_chalk);

var _ora = __webpack_require__(3);

var _ora2 = _interopRequireDefault(_ora);

var _findup = __webpack_require__(21);

var _findup2 = _interopRequireDefault(_findup);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Spinner = exports.Spinner = function () {
  function Spinner() {
    _classCallCheck(this, Spinner);

    this.defaultConfig = {
      text: 'waiting'
    };
    this.configs = {
      wait: {
        text: 'Init building may take more time, please be patient',
        color: 'white',
        spinner: 'clock'
      },
      running: {
        text: 'Re-building',
        color: 'yellow',
        spinner: 'runner'
      },
      done: {
        text: 'http://127.0.0.1:3000',
        color: 'green',
        spinner: 'earth'
      },
      error: {
        text: 'Got a error: TODO',
        color: 'red',
        spinner: {
          interval: 0,
          frames: ['✖ ']
        }
      }
    };
  }

  Spinner.prototype.stop = function stop() {
    this.spinner && this.spinner.stop();
  };

  /*
  spinner.start('done')
  spinner.start('done', {text: 'done'})
  spinner.start({text: 'done'})
   */


  Spinner.prototype.start = function start() {
    var type = arguments.length <= 0 || arguments[0] === undefined ? this.defaultConfig : arguments[0];
    var option = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    var opt = {};
    opt = type + '' === type ? Object.assign({}, this.configs[type] || {}, option) : type;
    this.stop();
    this.spinner = (0, _ora2.default)(opt).start();
  };

  return Spinner;
}();

var symbols = process.platform === 'win32' ? {
  info: 'i',
  success: '√',
  warning: '‼',
  error: '×'
} : {
  info: 'ℹ',
  success: '✔',
  warning: '⚠',
  error: '✖'
};

var colors = {
  info: 'blue',
  success: 'green',
  warning: 'yellow',
  error: 'red'
};

var renderLog = function renderLog(type) {
  return function () {
    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    console.log('');
    args.map(function (arg) {
      return console.log(_chalk2.default[colors[type]](symbols[type]) + ' ' + arg);
    });
  };
};

var log = exports.log = {};

Object.keys(symbols).map(function (symbol) {
  log[symbol] = renderLog(symbol);
});

var wait = exports.wait = function wait(time) {
  return new Promise(function (resolve, reject) {
    return setTimeout(resolve, 1000 * time);
  });
};

var pathExists = exports.pathExists = function pathExists(path) {
  return new Promise(function (resolve) {
    _fs2.default.access(path, function (err) {
      resolve(!err);
    });
  });
};

var findRoot = exports.findRoot = function findRoot(filename, dir) {
  try {
    return _findup2.default.sync(dir, filename);
  } catch (err) {
    // not found
    return null;
  }
};

var getSubDirs = exports.getSubDirs = function getSubDirs(parent) {
  return new Promise(function (resolve, reject) {
    _fs2.default.readdir(parent, function (err, data) {
      if (err) return reject(err);
      resolve(data.filter(function (dir) {
        return _fs2.default.statSync(_path2.default.join(parent, dir)).isDirectory();
      }));
    });
  });
};

var ListenerManager = exports.ListenerManager = function () {
  function ListenerManager(listener) {
    var _this = this;

    _classCallCheck(this, ListenerManager);

    this.key = 0;
    this.connections = {};
    this.listener = listener;
    this.listener.on('connection', function (conn) {
      var key = ++_this.key;
      _this.connections[key] = conn;
      conn.on('close', function () {
        delete _this.connections[key];
      });
    });
  }

  ListenerManager.prototype.dispose = function dispose() {
    var _this2 = this;

    return new Promise(function (resolve) {
      Object.keys(_this2.connections).forEach(function (key) {
        return _this2.connections[key].destroy();
      });
      if (_this2.listener) {
        _this2.listener.close(function () {
          return resolve();
        });
      } else {
        resolve();
      }
    });
  };

  return ListenerManager;
}();

/***/ },
/* 1 */
/***/ function(module, exports) {

module.exports = require("chalk");

/***/ },
/* 2 */
/***/ function(module, exports) {

module.exports = require("path");

/***/ },
/* 3 */
/***/ function(module, exports) {

module.exports = require("ora");

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _path = __webpack_require__(2);

var _path2 = _interopRequireDefault(_path);

var _commander = __webpack_require__(19);

var _commander2 = _interopRequireDefault(_commander);

var _chalk = __webpack_require__(1);

var _chalk2 = _interopRequireDefault(_chalk);

var _utils = __webpack_require__(0);

var _package = __webpack_require__(18);

var _package2 = _interopRequireDefault(_package);

var _dev = __webpack_require__(8);

var _dev2 = _interopRequireDefault(_dev);

var _build = __webpack_require__(6);

var _build2 = _interopRequireDefault(_build);

var _init = __webpack_require__(10);

var _init2 = _interopRequireDefault(_init);

var _list = __webpack_require__(11);

var _list2 = _interopRequireDefault(_list);

var _generate = __webpack_require__(9);

var _generate2 = _interopRequireDefault(_generate);

var _deploy = __webpack_require__(7);

var _deploy2 = _interopRequireDefault(_deploy);

var _update = __webpack_require__(12);

var _update2 = _interopRequireDefault(_update);

var _upgrade = __webpack_require__(13);

var _upgrade2 = _interopRequireDefault(_upgrade);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var cwdPath = _path2.default.resolve('.'); // var program = require('commander')

var projectRootPath = (0, _utils.findRoot)('fe.config.js', cwdPath) || (0, _utils.findRoot)('fe.config.babel.js', cwdPath);

if (!projectRootPath) {
  _utils.log.warning('No ' + _chalk2.default.magenta.underline('fe.config.js') + ' or ' + _chalk2.default.magenta.underline('fe.config.babel.js') + ' found, run ' + _chalk2.default.magenta.underline('fe init') + ' first in your project\'s root folder');
  projectRootPath = cwdPath;
}

var version = _package2.default.version;

_commander2.default
// .command('info <dir> [thing]', 'xxx')
.version(version || '0.0.1').description('A modern development workflow: ' + _chalk2.default.magenta.underline('fe init') + ' > ' + _chalk2.default.magenta.underline('fe dev') + ' > ' + _chalk2.default.magenta.underline('fe g route'));

// Inject more opts on commander.prototype.opts
Object.assign(_commander2.default.opts, {
  projectRootPath: projectRootPath,
  version: version
});

_commander2.default.command('dev').description('Enter ' + _chalk2.default.yellow.underline('development') + ' mode, with liveload support').alias('d').option('-p, --port', 'Add peppers').action(_dev2.default);

_commander2.default.command('build').description(_chalk2.default.green.underline('Build') + ' static assets with dependencies').alias('b').option('-w, --watch', 'Watching mode').action(_build2.default);

_commander2.default.command('init [ui]').description('Initiate a project with [' + _chalk2.default.white.underline('empty') + '|' + _chalk2.default.red.underline('cms') + '|' + _chalk2.default.gray.underline('link') + '] ui bolierplate').action(_init2.default);

_commander2.default.command('list').description('List the components in ' + _chalk2.default.magenta.underline('fe') + '-ecosystem').alias('l').action(_list2.default);

_commander2.default.command('generate [thing]').description('Generate [' + _chalk2.default.underline('component') + '|' + _chalk2.default.underline('route') + ']').alias('g').action(_generate2.default);

_commander2.default.command('deploy [env]').description('Deploy code to spec env').action(_deploy2.default);

_commander2.default.command('update').description('Update local outdated modules').alias('up').action(_update2.default);

_commander2.default.command('upgrade').description('Upgrade ' + _chalk2.default.magenta.underline('fe') + ' tool').action(_upgrade2.default.bind(null, version));

_commander2.default.on('--help', function () {
  console.log('  Examples:');
  console.log('');
  console.log('    $ fe dev -p 3000');
  console.log('    $ fe dev -h');
  console.log('');
});

_commander2.default.parse(process.argv);

if (!_commander2.default.args.length) _commander2.default.help();
/* if (!process.argv.slice(2).length) {
  commander.outputHelp()
}*/
exports.default = _commander2.default;

/***/ },
/* 5 */
/***/ function(module, exports) {

module.exports = require("babel-polyfill");

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _path = __webpack_require__(2);

var _path2 = _interopRequireDefault(_path);

var _webpack = __webpack_require__(32);

var _webpack2 = _interopRequireDefault(_webpack);

var _chalk = __webpack_require__(1);

var _chalk2 = _interopRequireDefault(_chalk);

var _utils = __webpack_require__(0);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var spinner = new _utils.Spinner();

exports.default = function (cmd) {
  var cwd = cmd.opts.projectRootPath;
  var compiler = (0, _webpack2.default)({
    entry: {
      'index': [_path2.default.join(cwd, 'src/index.js')]
    },
    output: {
      path: _path2.default.join(cwd, 'dist'),
      filename: '[name].js',
      // publicPath: 'http://localhost:3000/static/'
      publicPath: ''
      // publicPath: `http://localhost:${port}/`
    }
  });

  spinner.start('running', {
    text: 'Building, current path: ' + _chalk2.default.magenta.underline(cwd)
  });

  compiler.run(function (err, stats) {
    spinner.stop();
    err ? _utils.log.error(err) : _utils.log.success('Built successed!');
  });

  cmd.watch && compiler.watch({ // watch options:
    aggregateTimeout: 300, // wait so long for more changes
    poll: true // use polling instead of native watchers
    // pass a number to set the polling interval
  }, function (err, stats) {
    console.log(1111);
    err ? _utils.log.error(err) : _utils.log.success('Built successed!');
  });
};

/***/ },
/* 7 */
/***/ function(module, exports) {

"use strict";
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (cmd) {
  console.log('deploy');
};

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _path = __webpack_require__(2);

var _path2 = _interopRequireDefault(_path);

var _chokidar = __webpack_require__(35);

var _chokidar2 = _interopRequireDefault(_chokidar);

var _utils = __webpack_require__(0);

__webpack_require__(16);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// import webpack from 'webpack'

var spinner = new _utils.Spinner();

/*
watch

mock

hotload

complile
 */
var PORT = 3001;

var Server = function () {
  function Server(cwd, mockPath) {
    _classCallCheck(this, Server);

    this.listenerManager = null;
    this.mockPath = mockPath;
    this.cwd = cwd;
  }

  Server.prototype.restart = function restart() {
    delete __webpack_require__.c[/*require.resolve*/(14)];
    delete __webpack_require__.c[/*require.resolve*/(17)];
    /* Object.keys(require.cache).forEach(modulePath => {
      // delete require.cache[modulePath]
       // console.log(this.mockPath)
      // console.log(modulePath)
      if (~modulePath.indexOf(this.mockPath)) {
        console.log(modulePath)
        delete require.cache[modulePath]
      }
       if (~modulePath.indexOf('devServer')) {
        delete require.cache[modulePath]
      }
       if (~modulePath.indexOf('mockServer')) {
        delete require.cache[modulePath]
      }
    })*/

    this.stop();
    this.start();
  };

  Server.prototype.start = function start(cb) {
    var _this = this;

    var devServer = __webpack_require__(14).default;
    var mockServer = __webpack_require__(17).default;
    devServer.context.cwd = this.cwd;
    mockServer(devServer);
    var server = devServer.listen(PORT, function () {
      cb && cb.call(_this);
      // console.log(`Server started on ${PORT}`)
    });
    this.listenerManager = new _utils.ListenerManager(server);
  };

  Server.prototype.stop = function stop() {
    this.listenerManager && this.listenerManager.dispose();
  };

  return Server;
}();

exports.default = function () {
  var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(cmd) {
    var mockPath, server, watcher;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            /*  mockServer(devServer)
              let server = devServer.listen(PORT, () => {
                console.log(`Server started on ${PORT}`)
              })
              let listenerManager = new ListenerManager(server)
            
              // await wait(4)*/
            spinner.start('wait');
            mockPath = _path2.default.join(cmd.opts.projectRootPath, 'MOCK');
            server = new Server(cmd.opts.projectRootPath, mockPath);

            server.start(function () {
              spinner.start('done', {
                text: 'MockServer: http://127.0.0.1:' + PORT
              });
            });
            // watch
            watcher = _chokidar2.default.watch(mockPath);

            watcher.on('ready', function () {
              watcher.on('add', server.restart.bind(server)).on('addDir', server.restart.bind(server)).on('change', server.restart.bind(server)).on('unlink', server.restart.bind(server)).on('unlinkDir', server.restart.bind(server));
            });

            // spinner.start('running')
            // await wait(2)
            // spinner.start('done')
            // await wait(2)
            // spinner.start('error')
            // await wait(2)

          case 6:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, undefined);
  }));

  return function (_x) {
    return _ref.apply(this, arguments);
  };
}();

/*
var WebpackDevServer = require("webpack-dev-server");
var webpack = require("webpack");

var compiler = webpack({
  // configuration
});

var server = new WebpackDevServer(compiler, {
  // webpack-dev-server options

  contentBase: "/path/to/directory",
  // or: contentBase: "http://localhost/",

  hot: true,
  // Enable special support for Hot Module Replacement
  // Page is no longer updated, but a "webpackHotUpdate" message is send to the content
  // Use "webpack/hot/dev-server" as additional module in your entry point
  // Note: this does _not_ add the `HotModuleReplacementPlugin` like the CLI option does.

  // Set this as true if you want to access dev server from arbitrary url.
  // This is handy if you are using a html5 router.
  historyApiFallback: false,

  // Set this if you want to enable gzip compression for assets
  compress: true,

  // Set this if you want webpack-dev-server to delegate a single path to an arbitrary server.
  // Use "*" to proxy all paths to the specified server.
  // This is useful if you want to get rid of 'http://localhost:8080/' in script[src],
  // and has many other use cases (see https://github.com/webpack/webpack-dev-server/pull/127 ).
  proxy: {
    "*": "http://localhost:9090"
  },

  // pass [static options](http://expressjs.com/en/4x/api.html#express.static) to inner express server
  staticOptions: {
  },

  // webpack-dev-middleware options
  quiet: false,
  noInfo: false,
  lazy: true,
  filename: "bundle.js",
  watchOptions: {
    aggregateTimeout: 300,
    poll: 1000
  },
  publicPath: "/assets/",
  headers: { "X-Custom-Header": "yes" },
  stats: { colors: true }
});
server.listen(8080, "localhost", function() {});
// server.close();*/

/***/ },
/* 9 */
/***/ function(module, exports) {

"use strict";
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (cmd) {
  console.log('generate');
};

/***/ },
/* 10 */
/***/ function(module, exports) {

"use strict";
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (cmd) {
  console.log('init');
};

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _chalk = __webpack_require__(1);

var _chalk2 = _interopRequireDefault(_chalk);

var _utils = __webpack_require__(0);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; } // import request from 'request'


var request = __webpack_require__(29);


// Planning to use github group to store list
var list = [{
  name: 'components',
  usage: 'npm i [name] -S',
  url: 'https://api.github.com/users/fe-components/repos'
}, {
  name: 'templates',
  usage: 'fe init [name]',
  url: 'https://api.github.com/users/fe-templates/repos'
}];

var spinner = new _utils.Spinner();

var reporter = function reporter(body) {
  // console.log()
  // console.log('')
  _utils.log.info('Available official ' + body.reporter_name + ' (usage: ' + _chalk2.default.magenta.underline(body.reporter_usage) + '):');
  console.log();
  body.forEach(function (repo) {
    console.log('  ' + _chalk2.default.yellow('★') + '  ' + _chalk2.default.blue(repo.name) + ' - ' + (repo.description || ''));
  });
};

var fetchList = function fetchList(list) {
  return new Promise(function (resolve, reject) {
    request({
      url: list.url,
      headers: {
        'User-Agent': 'fe'
      }
    }, function (err, res, body) {
      if (err) return reject(err);
      try {
        resolve(Object.assign(JSON.parse(body), {
          reporter_name: list.name,
          reporter_usage: list.usage
        }));
      } catch (err) {
        reject(body);
      }
    });
  });
};

exports.default = _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
  var promises, results;
  return regeneratorRuntime.wrap(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          promises = list.map(function (item) {
            return fetchList(item);
          });

          spinner.start({
            text: 'fetching...'
          });
          _context.next = 4;
          return Promise.all(promises).catch(function (err) {
            return _utils.log.error(err);
          });

        case 4:
          results = _context.sent;

          spinner.stop();
          results.map(reporter);

        case 7:
        case 'end':
          return _context.stop();
      }
    }
  }, _callee, undefined);
}));

/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _updtr = __webpack_require__(31);

exports.default = function (cmd) {
  return (0, _updtr.run)({
    cwd: cmd.opts.projectRootPath,
    reporter: _updtr.reporters.default
    // wanted: commander.wanted,
    // testCmd: commander.test,
    // exclude: commander.exclude,
    // testStdout: commander.testStdout,
    // saveExact: commander.saveExact,
    // registry: commander.registry
  }, function (err) {
    if (err) throw err;
  });
};

/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.checkVersion = undefined;

var _ora = __webpack_require__(3);

var _ora2 = _interopRequireDefault(_ora);

var _execa = __webpack_require__(20);

var _execa2 = _interopRequireDefault(_execa);

var _semver = __webpack_require__(30);

var _semver2 = _interopRequireDefault(_semver);

var _chalk = __webpack_require__(1);

var _chalk2 = _interopRequireDefault(_chalk);

var _utils = __webpack_require__(0);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

var checkVersion = exports.checkVersion = function () {
  var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(version) {
    var _ref2, stdout;

    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return _execa2.default.shell('npm show fe version').catch(_utils.log.error);

          case 2:
            _ref2 = _context.sent;
            stdout = _ref2.stdout;
            return _context.abrupt('return', _semver2.default.gt(stdout, version) ? stdout : false);

          case 5:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, undefined);
  }));

  return function checkVersion(_x) {
    return _ref.apply(this, arguments);
  };
}();

exports.default = function () {
  var _ref3 = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(cmd) {
    var spinner, shouldUpgrade;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            spinner = (0, _ora2.default)({
              text: 'Checking for new version',
              color: 'yellow'
              // spinner: process.argv[2]
            }).start();
            _context2.next = 3;
            return checkVersion(cmd.opts.version);

          case 3:
            shouldUpgrade = _context2.sent;

            if (shouldUpgrade) {
              _context2.next = 7;
              break;
            }

            spinner.stop();
            return _context2.abrupt('return', _utils.log.success('You are using the latest version'));

          case 7:

            spinner.color = 'green';
            spinner.text = 'Installing new version ' + _chalk2.default.yellow(shouldUpgrade);
            _context2.next = 11;
            return _execa2.default.shell('npm install fe -g').catch(_utils.log.error);

          case 11:
            spinner.stop();
            _utils.log.success('You are using the latest version');

          case 13:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, undefined);
  }));

  return function (_x2) {
    return _ref3.apply(this, arguments);
  };
}();

/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _koa = __webpack_require__(23);

var _koa2 = _interopRequireDefault(_koa);

var _koaBodyparser = __webpack_require__(24);

var _koaBodyparser2 = _interopRequireDefault(_koaBodyparser);

var _koaJsonp = __webpack_require__(26);

var _koaJsonp2 = _interopRequireDefault(_koaJsonp);

var _kcors = __webpack_require__(34);

var _kcors2 = _interopRequireDefault(_kcors);

var _koaLogger = __webpack_require__(27);

var _koaLogger2 = _interopRequireDefault(_koaLogger);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var app = new _koa2.default();
// import cors from 'koa-cors'

app.proxy = true;
app.use((0, _koaLogger2.default)());

// TODO: wait for this: https://github.com/koajs/cors/pull/20
app.use(function (ctx, next) {
  ctx.set('Access-Control-Allow-Origin', '*');
  ctx.set('Access-Control-Allow-Methods', 'GET,HEAD,PUT,POST,DELETE');
  ctx.set('Access-Control-Allow-Credentials', 'true');
  return next();
});
app.use((0, _kcors2.default)({
  origin: '*'
}));
app.use((0, _koaJsonp2.default)());
app.use((0, _koaBodyparser2.default)({
  onerror: function onerror(err, ctx) {
    console.log(err);
    ctx.throw('body parse error', 422);
  }
}));

exports.default = app;

/***/ },
/* 15 */
/***/ function(module, exports) {

'use strict';

var fs = require('fs');
var path = require('path');
var chokidar = require('chokidar');
var getSubDirs = function getSubDirs(parent) {
  return fs.readdirSync(parent).filter(function (dir) {
    return fs.statSync(path.join(parent, dir)).isDirectory();
  });
};
/*
├── mock
│└── TaskList
│    ├── index.js
│    └── task-list.json
 */
var MOCK = 'mock';

module.exports = function (cwd) {
  var mockPath = path.join(cwd, MOCK);
  var mockPaths = getSubDirs(mockPath);
  var watcher = chokidar.watch(mockPath);
  watcher.on('ready', function () {
    watcher
    // .on('add', compileHotServer)
    // .on('addDir', compileHotServer)
    .on('change', function () {
      Object.keys(require.cache).forEach(function (modulePath) {
        // console.log(modulePath)
        if (~modulePath.indexOf(mockPath)) {
          delete require.cache[modulePath];
        }
      });
    });
    // .on('unlink', compileHotServer)
    // .on('unlinkDir', compileHotServer)
  });

  return mockPaths.map(function (item) {
    var result = [];
    try {
      result = require(path.join(mockPath, item));
    } catch (err) {
      console.log(err);
    }
    return result;
  });
};

/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.mockServer = exports.devServer = undefined;

var _devServer2 = __webpack_require__(14);

var _devServer3 = _interopRequireDefault(_devServer2);

var _mockServer2 = __webpack_require__(17);

var _mockServer3 = _interopRequireDefault(_mockServer2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.devServer = _devServer3.default;
exports.mockServer = _mockServer3.default;

/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _koaRouter = __webpack_require__(28);

var _koaRouter2 = _interopRequireDefault(_koaRouter);

var _getMockRoutes = __webpack_require__(15);

var _getMockRoutes2 = _interopRequireDefault(_getMockRoutes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// default

exports.default = function (app) {
  var router = new _koaRouter2.default();
  var routes = (0, _getMockRoutes2.default)(app.context.cwd);
  routes.map(function (items) {
    items.map(function (config) {
      var _config$method = config.method;
      var method = _config$method === undefined ? 'get' : _config$method;
      var _config$route = config.route;
      var route = _config$route === undefined ? '' : _config$route;
      var _config$handler = config.handler;
      var handler = _config$handler === undefined ? {} : _config$handler;


      router[method.toLowerCase()](route, typeof handler === 'function' ? handler : function (ctx, next) {
        ctx.body = handler;
      });
      app.use(router.routes()).use(router.allowedMethods());
    });
  });
};

/***/ },
/* 18 */
/***/ function(module, exports) {

module.exports = {
	"name": "fe",
	"description": "Grunt plugin to generate grunt init templates",
	"version": "0.1.6",
	"homepage": "https://leecade.github.com/fe",
	"author": {
		"name": "leecade",
		"email": "leecade@163.com",
		"url": "https://github.com/leecade"
	},
	"repository": {
		"type": "git",
		"url": "git://github.com/leecade/fe.git"
	},
	"bugs": {
		"url": "https://github.com/leecade/fe/issues"
	},
	"dependencies": {
		"chalk": "^1.1.3",
		"chokidar": "^1.6.0",
		"colors": "^1.1.2",
		"commander": "^2.9.0",
		"debug": "^2.2.0",
		"execa": "^0.4.0",
		"express": "^4.14.0",
		"findup": "^0.1.5",
		"kcors": "^2.1.1",
		"koa": "^2.0.0",
		"koa-bodyparser": "^3.1.0",
		"koa-cors": "0.0.16",
		"koa-jsonp": "^2.0.2",
		"koa-logger": "^2.0.0",
		"koa-router": "^7.0.1",
		"listr": "^0.4.1",
		"metalsmith": "^2.1.0",
		"ora": "^0.2.3",
		"progress": "^1.1.8",
		"request": "^2.72.0",
		"semver": "^5.2.0",
		"updtr": "^0.2.1",
		"webpack": "^2.1.0-beta.15",
		"webpack-dev-middleware": "^1.6.1",
		"webpack-dev-server": "^2.1.0-beta.0",
		"webpack-hot-middleware": "^2.12.0"
	},
	"devDependencies": {
		"babel-core": "^6.10.4",
		"babel-eslint": "^6.1.0",
		"babel-loader": "^6.2.4",
		"babel-polyfill": "^6.9.1",
		"babel-preset-fe": "^1.0.11",
		"espower": "^1.3.2",
		"json-loader": "^0.5.4",
		"power-assert": "^1.4.1",
		"pre-commit": "^1.1.3",
		"snazzy": "^4.0.0",
		"standard": "^7.1.2",
		"webpack": "^2.1.0-beta.15"
	},
	"keywords": [
		"fe"
	],
	"engines": {
		"npm": "3.x"
	},
	"main": "lib/index.js",
	"files": [
		"bin",
		"lib"
	],
	"bin": "bin/fe",
	"scripts": {
		"dev": "webpack --watch",
		"start": "npm run dev",
		"prepublish": "npm version patch -m \"bump %s\"",
		"precommit": "git diff --name-only --cached --relative | grep '\\.jsx\\?$' | xargs standard | snazzy; if [ $? -ne 0 ]; then exit 1; fi"
	},
	"pre-commit": {
		"run": [
			"precommit"
		],
		"silent": true
	},
	"standard": {
		"parser": "babel-eslint",
		"global": [
			"fetch"
		],
		"ignore": [
			"bin/",
			"lib/",
			"mock/",
			"example/dist/",
			"node_modules/"
		]
	},
	"license": "MIT"
};

/***/ },
/* 19 */
/***/ function(module, exports) {

module.exports = require("commander");

/***/ },
/* 20 */
/***/ function(module, exports) {

module.exports = require("execa");

/***/ },
/* 21 */
/***/ function(module, exports) {

module.exports = require("findup");

/***/ },
/* 22 */
/***/ function(module, exports) {

module.exports = require("fs");

/***/ },
/* 23 */
/***/ function(module, exports) {

module.exports = require("koa");

/***/ },
/* 24 */
/***/ function(module, exports) {

module.exports = require("koa-bodyparser");

/***/ },
/* 25 */,
/* 26 */
/***/ function(module, exports) {

module.exports = require("koa-jsonp");

/***/ },
/* 27 */
/***/ function(module, exports) {

module.exports = require("koa-logger");

/***/ },
/* 28 */
/***/ function(module, exports) {

module.exports = require("koa-router");

/***/ },
/* 29 */
/***/ function(module, exports) {

module.exports = require("request");

/***/ },
/* 30 */
/***/ function(module, exports) {

module.exports = require("semver");

/***/ },
/* 31 */
/***/ function(module, exports) {

module.exports = require("updtr");

/***/ },
/* 32 */
/***/ function(module, exports) {

module.exports = require("webpack");

/***/ },
/* 33 */
/***/ function(module, exports, __webpack_require__) {

__webpack_require__(5);
module.exports = __webpack_require__(4);


/***/ },
/* 34 */
/***/ function(module, exports) {

module.exports = require("kcors");

/***/ },
/* 35 */
/***/ function(module, exports) {

module.exports = require("chokidar");

/***/ }
/******/ ]);