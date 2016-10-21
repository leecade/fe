// Resolve modules wrapper
// TODO: more test and flexable
const MODULE_PATH = '/usr/local/lib/node_modules'
const resolve = require.resolve

// A hack for fix some case module.paths not includes NODE_PATH
if (!module.paths.includes(MODULE_PATH)) {
  module.paths = module.paths.concat(MODULE_PATH)
}

export default resolve
