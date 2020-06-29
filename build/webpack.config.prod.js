const path = require('path');
const webpack = require("webpack");
const merge = require("webpack-merge");
// 清除目录
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
// 分离css
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
// 压缩css
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const webpackConfigBase = require('./webpack.config.base');

const webpackConfigProd = {
	mode: 'production', // 通过 mode 声明生产环境
	output: {
		filename: 'js/[name].[hash].js',
    path: path.resolve(__dirname, '../dist'),
    publicPath: './'
  },
  
  devtool: 'cheap-module-eval-source-map',

  plugins: [
		// 调用之前先清除
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: 'css/[name].[hash:8].css',
      chunkFilename: 'css/[id].css'
    }),
    new OptimizeCssAssetsPlugin()
		// new webpack.DefinePlugin({
		// 	'process.env.BASE_URL': '\"' + process.env.BASE_URL + '\"'
		// })
	]
}
module.exports = merge(webpackConfigBase, webpackConfigProd);