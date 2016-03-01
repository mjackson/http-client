require('es6-promise').polyfill()
require('whatwg-fetch')

const context = require.context('./modules', true, /-test\.js$/)
context.keys().forEach(context)
