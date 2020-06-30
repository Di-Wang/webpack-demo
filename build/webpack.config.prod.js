const path = require('path');
const webpack = require("webpack");
const merge = require("webpack-merge");
// 清除目录
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
// 分离css
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
// 压缩css
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
// 测试或生产环境
const env = require(`${JSON.parse(process.env.npm_config_argv).original[1] == 'test'?'./env.test':'./env.production'}`);
const webpackConfigBase = require('./webpack.config.base');

console.log(env.outputDir);

const webpackConfigProd = {
	mode: 'production', // 通过 mode 声明生产环境
	output: {
		filename: 'js/[name].[hash].js',
    path: path.resolve(__dirname, `../${JSON.parse(env.outputDir)}`),
    publicPath: './'
  },
  
  devtool: 'cheap-module-eval-source-map',

  plugins: [
    // 允许在编译时(compile time)配置的全局常量
    new webpack.DefinePlugin({
      'process.env': env
    }),
		// 调用之前先清除
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: 'css/[name].[hash:8].css',
      chunkFilename: 'css/[id].css'
    }),
    new OptimizeCssAssetsPlugin()
	]
}
module.exports = merge(webpackConfigBase, webpackConfigProd);