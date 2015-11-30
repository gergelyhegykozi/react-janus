var path = require('path')
var webpack = require('webpack')

module.exports = {
  entry: {
    app: './index.js'
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name].js'
  },
  devtool: 'eval',
  debug: true,
  module: {
    loaders: [
      { test: /\.js$/, exclude: /node_modules/, loaders: ['react-hot', 'babel-loader'] },
      { test: /\.jsx?$/, exclude: /(node_modules|bower_components)/, loader: 'babel' }
    ]
  },
  devServer: {
    contentBase: './',
    hot: false,
    inline: true
  }
}

var reactJanusSrc = path.join(__dirname, '..', '..', 'src')
var fs = require('fs')
if (fs.existsSync(reactJanusSrc)) {
  // Compile react-janus from source
  module.exports.module.loaders.concat([
    { test: /\.js$/, include: reactJanusSrc, loaders: ['react-hot', 'babel-loader'] },
    { test: /\.jsx?$/, include: reactJanusSrc, loader: 'babel' }
  ])
  // Resolve react-janus to source
  module.exports.resolve = {
    alias: {
      'react-janus': reactJanusSrc
    }
  }
}
