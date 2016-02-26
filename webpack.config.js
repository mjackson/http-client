var path = require('path')
var webpack = require('webpack')

module.exports = {

  output: {
    library: 'Dropbox',
    libraryTarget: 'umd'
  },

  module: {
    loaders: [
      { test: /whatwg-fetch/, loader: 'imports?this=>window!exports?global.fetch' },
      { test: /\.js$/, exclude: /node_modules/, loader: 'babel' }
    ]
  },

  resolve: {
    alias: {
      'node-fetch': 'whatwg-fetch'
    }
  },

  plugins: [
    new webpack.ProvidePlugin({
      'Promise': 'es6-promise'
    })
  ]

}
