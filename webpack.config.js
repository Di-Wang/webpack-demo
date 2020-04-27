
const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');

const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');

module.exports = {
  entry: {
    page1: './src/pages/page1/index.js',
    page2: './src/pages/page2/index.js',
  },
  output: {
    filename: './js/[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.(css|scss|sass)$/,
        // css分离写法
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              // 这里可以指定一个 publicPath
              // 默认使用 webpackOptions.output中的publicPath
              publicPath: "../"
            }
          },
          'css-loader',
          'postcss-loader',
          'sass-loader'
        ]
      },
      {
        test: /\.m?js$/,
        exclude: /(node_modules)|(bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      }, 
      {
        test: /\.(png|jpe?g|gif)$/,
        use: [{
          loader: 'url-loader',
          options: {
            name: '[name].[ext]',
            outputPath: 'images',
            limit: 1024
          }
        }]
      }, {
        test: /\.(TTF|eot|woff|woff2)$/i,
        use: [{
          loader: 'file-loader',
          options: {
            outputPath: 'fonts'
          }
        }]
      },
      {
        test: require.resolve('jquery'),
        use: [{
          loader: 'expose-loader',
          options: 'jQuery'
        }, {
          loader: 'expose-loader',
          options: '$'
        }]
      }
    ]
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    // 调用之前先清除
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      filename: 'page1.html',
      template: './src/pages/page1/index.html',
      chunks: ['page1']
    }),
    new HtmlWebpackPlugin({
      filename: 'page2.html',
      template: './src/pages/page2/index.html',
      chunks: ['page2']
    }),
    new MiniCssExtractPlugin({
      filename: 'css/[name].css',
      chunkFilename: 'css/[id].css'
    }),
    new OptimizeCssAssetsPlugin()
  ]
}






//   devServer: {
//     contentBase: path.join(__dirname, "dist"),
//     publicPath:'/',
//     host: "127.0.0.1",
//     port: "8090",
//     overlay: true, // 浏览器页面上显示错误
//     open: true, // 开启浏览器
//     // stats: "errors-only", //stats: "errors-only"表示只打印错误：
//     hot: true, // 开启热更新
//     //服务器代理配置项
//     proxy: {
//       '/test/*':{
//         target: 'https://www.baidu.com',
//         secure: true,
//         changeOrigin: true
//       }
//     }
//   },