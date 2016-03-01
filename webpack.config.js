var webpack = require('webpack')

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

  plugins: [
    new webpack.IgnorePlugin(/node-fetch/),
    new webpack.DefinePlugin({
      'typeof window': JSON.stringify('object')
    })
  ]

}
