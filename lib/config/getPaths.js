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

/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};

/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 42);
/******/ })
/************************************************************************/
/******/ ({

/***/ 0:
/* unknown exports provided */
/* all exports used */
/*!***********************!*\
  !*** external "path" ***!
  \***********************/
/***/ function(module, exports) {

eval("module.exports = require(\"path\");//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiMC5qcyIsInNvdXJjZXMiOlsid2VicGFjazovLy9leHRlcm5hbCBcInBhdGhcIj81YjJhIl0sInNvdXJjZXNDb250ZW50IjpbIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcInBhdGhcIik7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gZXh0ZXJuYWwgXCJwYXRoXCJcbi8vIG1vZHVsZSBpZCA9IDBcbi8vIG1vZHVsZSBjaHVua3MgPSAwIDEgMiA1Il0sIm1hcHBpbmdzIjoiQUFBQSIsInNvdXJjZVJvb3QiOiIifQ==");

/***/ },

/***/ 42:
/* unknown exports provided */
/* all exports used */
/*!****************************!*\
  !*** ./config/getPaths.js ***!
  \****************************/
/***/ function(module, exports, __webpack_require__) {

"use strict";
eval("'use strict';Object.defineProperty(exports,\"__esModule\",{value:true});var _path=__webpack_require__(/*! path */ 0);var _path2=_interopRequireDefault(_path);function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj};}// import fs from 'fs'\nexports.default=function(projectRootPath){var resolveApp=function resolveApp(relativePath){return _path2.default.resolve(projectRootPath,relativePath);};var nodePaths=(process.env.NODE_PATH||'').split(process.platform==='win32'?';':':').filter(Boolean).map(resolveApp);return{appBuild:resolveApp('build'),appPublic:resolveApp('public'),appHtml:resolveApp('public/index.html'),appIndexJs:resolveApp('src/index.js'),appPackageJson:resolveApp('package.json'),appSrc:resolveApp('src'),testsSetup:resolveApp('src/setupTests.js'),appNodeModules:resolveApp('node_modules'),ownNodeModules:resolveApp('node_modules'),nodePaths:nodePaths};};//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiNDIuanMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vc3JjL2NvbmZpZy9nZXRQYXRocy5qcz8xYzYyIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBwYXRoIGZyb20gJ3BhdGgnXG4vLyBpbXBvcnQgZnMgZnJvbSAnZnMnXG5cbmV4cG9ydCBkZWZhdWx0IHByb2plY3RSb290UGF0aCA9PiB7XG4gIGNvbnN0IHJlc29sdmVBcHAgPSByZWxhdGl2ZVBhdGggPT4gcGF0aC5yZXNvbHZlKHByb2plY3RSb290UGF0aCwgcmVsYXRpdmVQYXRoKVxuICBjb25zdCBub2RlUGF0aHMgPSAocHJvY2Vzcy5lbnYuTk9ERV9QQVRIIHx8ICcnKVxuICAgIC5zcGxpdChwcm9jZXNzLnBsYXRmb3JtID09PSAnd2luMzInID8gJzsnIDogJzonKVxuICAgIC5maWx0ZXIoQm9vbGVhbilcbiAgICAubWFwKHJlc29sdmVBcHApXG4gIHJldHVybiB7XG4gICAgYXBwQnVpbGQ6IHJlc29sdmVBcHAoJ2J1aWxkJyksXG4gICAgYXBwUHVibGljOiByZXNvbHZlQXBwKCdwdWJsaWMnKSxcbiAgICBhcHBIdG1sOiByZXNvbHZlQXBwKCdwdWJsaWMvaW5kZXguaHRtbCcpLFxuICAgIGFwcEluZGV4SnM6IHJlc29sdmVBcHAoJ3NyYy9pbmRleC5qcycpLFxuICAgIGFwcFBhY2thZ2VKc29uOiByZXNvbHZlQXBwKCdwYWNrYWdlLmpzb24nKSxcbiAgICBhcHBTcmM6IHJlc29sdmVBcHAoJ3NyYycpLFxuICAgIHRlc3RzU2V0dXA6IHJlc29sdmVBcHAoJ3NyYy9zZXR1cFRlc3RzLmpzJyksXG4gICAgYXBwTm9kZU1vZHVsZXM6IHJlc29sdmVBcHAoJ25vZGVfbW9kdWxlcycpLFxuICAgIG93bk5vZGVNb2R1bGVzOiByZXNvbHZlQXBwKCdub2RlX21vZHVsZXMnKSxcbiAgICBub2RlUGF0aHM6IG5vZGVQYXRoc1xuICB9XG59XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gc3JjL2NvbmZpZy9nZXRQYXRocy5qcyJdLCJtYXBwaW5ncyI6IkFBQUE7QUFHQSIsInNvdXJjZVJvb3QiOiIifQ==");

/***/ }

/******/ });