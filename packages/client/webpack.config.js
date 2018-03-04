require('dotenv').load()
const path = require('path')
const webpack = require('webpack')

const HtmlWebpackPlugin = require('html-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')


module.exports = {
  entry: {
    app: [
      'whatwg-fetch',
      path.resolve(__dirname, './src/index.tsx')
    ]
  },
  devtool: 'inline-source-map',
  devServer: {
    contentBase: './build'
  },
  module: {
    rules: [
      { test: /\.tsx?$/, loader: 'ts-loader' }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(['build']),
    new HtmlWebpackPlugin(),
    new webpack.EnvironmentPlugin(['GOOGLE_MAPS_API_KEY'])
  ],
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: '[name].[hash].js'
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js']
  },
}