require('es6-promise').polyfill()
require('cross-fetch/polyfill')

const context = require.context('./modules', true, /-test\.js$/)
context.keys().forEach(context)
