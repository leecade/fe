#!/usr/bin/env node
'use strict'

const debug = require('debug')('fe')
debug.enabled && require('time-require')
console.log(require('../lib').default(process.argv))
