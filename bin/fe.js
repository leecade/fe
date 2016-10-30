#!/usr/bin/env node

// for dev
// NODE_ENV=dev fe
const isDev = (process.env.NODE_ENV + '').toLowerCase() === 'dev'
isDev && console.log('[launch...]')
isDev && console.time('[load babel-polyfill]')
require('babel-polyfill')
isDev && console.timeEnd('[load babel-polyfill]')
require('../lib')
