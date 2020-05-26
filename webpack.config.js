
const path = require('path');
const webpack = require('webpack');
const glob = require('glob');
// 清除目录
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
// html模板
const HtmlWebpackPlugin = require('html-webpack-plugin');
// 分离css
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
// 压缩css
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');

// 多页面打包
const setMPA = () => {
  const entry = {};
  const htmlWebpackPlugins = [];

  const entryFiles = glob.sync(path.join(__dirname, './src/pages/**/index.js'))

  Object.keys(entryFiles).map(index => {
    const entryFile = entryFiles[index];
    const match = entryFile.match(/src\/pages\/(.*)\/index\.js/);
    const pageName = match && match[1];

    entry[pageName] = entryFile;
    htmlWebpackPlugins.push(
      new HtmlWebpackPlugin({
        template: path.join(__dirname, `src/pages/${pageName}/index.html`),
        filename: `${pageName}.html`,
        chunks: [pageName],
        inject: true,
        minify: {
          html5: true,
          collapseWhitespace: true,
          preserveLineBreaks: false,
          minifyCSS: true,
          minifyJS: true,
          removeComments: false
        }
      })
    );
  })
  console.log('entryFiles', entryFiles);

  return {
    entry,
    htmlWebpackPlugins
  }
}

const { entry, htmlWebpackPlugins } = setMPA();


//动态添加入口
// function getEntry() {
//   var entry = {};
//   //读取src目录所有page入口
//   glob.sync('./src/pages/**/*.js').forEach(function (name) {
//     console.log(name);

//     var start = name.indexOf('src/') + 4;
//     var end = name.length - 3;
//     var eArr = [];
//     var n = name.slice(start, end);
//     n = n.split('/')[1];
//     eArr.push(name);
//     eArr.push('babel-polyfill');
//     entry[n] = eArr;
//   })
//   return entry;
// }
//动态生成html
// //获取html-webpack-plugin参数的方法
// var getHtmlConfig = function (name, chunks) {
//   return {
//     template: `./src/pages/${name}.html`,
//     filename: `pages/${name}.html`,
//     inject: true,
//     hash: false,
//     chunks: [name]
//   }
// }
// //配置页面
// var entryObj = getEntry();
// var htmlArray = [];
// Object.keys(entryObj).forEach(function (element) {
//   htmlArray.push({
//     _html: element,
//     title: '',
//     chunks: [element]
//   })
// })
// //自动生成html模板
// htmlArray.forEach(function (element) {
//   module.exports.plugins.push(new HtmlWebpackPlugin(getHtmlConfig(element._html, element.chunks)));
// })

module.exports = {
  entry,
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
    //热更新模块，这样js改变就不会全部重载，而是只是重载你改过的那一部分
    new webpack.HotModuleReplacementPlugin(),
    // 调用之前先清除
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: 'css/[name].css',
      chunkFilename: 'css/[id].css'
    }),
    new OptimizeCssAssetsPlugin()
  ].concat(htmlWebpackPlugins)
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