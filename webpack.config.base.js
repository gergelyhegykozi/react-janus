'use strict';

var webpack = require('webpack');

module.exports = {
  output: {
    library: 'react-janus',
    libraryTarget: 'umd'
  },
  devtool: 'eval',
  debug: true,
  module: {
    loaders: [
      { test: /\.js$/, exclude: /node_modules/, loaders: ['react-hot', 'babel-loader'] },
      { test: /\.jsx?$/, exclude: /(node_modules|bower_components)/, loader: 'babel' }
    ]
  }
};
