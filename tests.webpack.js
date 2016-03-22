require('es6-promise').polyfill()
require('isomorphic-fetch')

const context = require.context('./modules', true, /-test\.js$/)
context.keys().forEach(context)
