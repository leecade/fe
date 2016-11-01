module.exports = {
  TITLE: 'PAGE_TITLE',
  HOST: 'localhost',
  HTTPS: false,
  DEV_SERVER_PORT: 3000,
  MOCK_PREFIX: '/_mock',
  // an example proxy to mock server
  // you may replace by your back-end server
  PROXY: {
    '/api': {
      target: 'http://localhost:3000/',
      pathRewrite: {'^/api': '/_mock'}

      // Or throgh bypass
      // bypass: req => {
      //   return req.url.replace(/^\/api(.+)$/, '/_mock$1')
      // }
    }
  },

  // update when fe env
  inChina: undefined,
  FE_CONFIG_FILE: 'fe.config.json',
  BUILD_DIR: 'build',
  CONFIG_DIR: 'config',
  MOCK_DIR: 'mock',
  PUBLIC_DIR: 'public',
  SRC_DIR: 'src',
  EMPTY_FILE: 'config/empty.js',
  TEMPLATE_FILE: 'config/template.ejs',
  ENTRY_FILE: 'src/index.js',
  POLYFILLS_FILE: 'config/polyfills.js',
  HTML_FILE: 'public/index.html',
  TEST_SETUP_FILE: 'config/setupTests.js',
  publicPath: ''
}
