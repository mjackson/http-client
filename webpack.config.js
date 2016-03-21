const webpack = require('webpack')

module.exports = {

  output: {
    library: 'HTTPClient',
    libraryTarget: 'umd'
  },

  module: {
    loaders: [
      { test: /\.js$/, exclude: /node_modules/, loader: 'babel' }
    ]
  },

  resolve: {
    packageAlias: 'browser'
  },

  plugins: [
    new webpack.DefinePlugin({
      'typeof window': JSON.stringify('object')
    })
  ]

}
