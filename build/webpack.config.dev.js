const path = require('path');
const webpack = require("webpack");
const merge = require('webpack-merge');
// 分离css
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
// 开发环境
const env = require('./env.development');

console.log(env);
const webpackConfigBase = require('./webpack.config.base');

const webpackConfigDev = {
  mode: 'development', // 通过 mode 声明开发环境
  output: {
    filename: 'js/[name].bundle.js',
    path: path.resolve(__dirname, '../dist')
  },

  devtool: 'source-map',

  plugins: [
    //热更新模块，这样js改变就不会全部重载，而是只是重载你改过的那一部分
    new webpack.HotModuleReplacementPlugin(),
    new MiniCssExtractPlugin({
      filename: 'css/[name].css',
      chunkFilename: 'css/[id].css'
    }),
    // 允许在编译时(compile time)配置的全局常量
    new webpack.DefinePlugin({
      'process.env': env
    })
  ]
}
module.exports = merge(webpackConfigBase, webpackConfigDev);