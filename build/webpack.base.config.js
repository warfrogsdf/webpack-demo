/**
 * Created by Su on 2017/12/23.
 */
const HtmlWebpackPlugin = require('html-webpack-plugin'); // 通过 npm 安装
const webpack = require('webpack'); // 用于访问内置插件
const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");

const config = {
  entry: {
    /*main: ['./src/entry-client.js'],*/
  },
  output: {
    path: path.resolve(__dirname, '../dist'),
    //filename: '[id]-[chunkhash:8].js'
    filename: '[name].js',
    //publicPath: 'https://static.bilibili.com/bmall/'
  },
  devServer: {
    contentBase: './dist',
    compress: true,
    port: 9000,
    /*allowedHosts: [
        'a.com'
    ],*/
    proxy: {
      "/api": "http://localhost:3000"
    },
    hot: true,
    /*open: true,*/
    disableHostCheck: true,
    headers: {
      "Access-Control-Allow-Origin": "*"
    }
  },
  resolve: {
    extensions: [".vue", ".js", ".json"],
    alias: {
      //xyz$: path.resolve(__dirname, 'path/to/file.js')
    }
  },
  module: {
    rules: [
      {test: /\.txt$/, use: 'raw-loader'},
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['es2015'],
            plugins: ['syntax-dynamic-import', 'add-module-exports']
          }
        }
      },
      {
        test: /\.vue$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'vue-loader',
          options: {
            loaders: {
              'less': 'vue-style-loader!css-loader!less-loader',
            }
          }
        }
      },
      /*{
          test: /\.(less|css)$/,
          use: [{
              loader: "style-loader" // creates style nodes from JS strings
          }, {
              loader: "css-loader" // translates CSS into CommonJS
          }, {
              loader: "less-loader" // compiles Less to CSS
          }]
      },*/
      {
        test: /\.(less|css)$/,
        use: ExtractTextPlugin.extract({
          fallback: {
            loader: "style-loader" // creates style nodes from JS strings
          },
          use: [{
            loader: "css-loader" // translates CSS into CommonJS
          }, {
            loader: "less-loader" // compiles Less to CSS
          }]
        })
      },
      {
        test: /\.(png|jpg|gif|jpe?g|svg|woff|ttf)$/i,
        use: [
          {
            loader: 'url-loader',
            options: {
              name: '[name]-[hash:8].[ext]',
              limit: 10/*,
                            outputPath: 'img/',
                            publicPath: 'img/'*/
            }
          }
        ]
      }
    ]
  },
  plugins: [
    //new webpack.optimize.UglifyJsPlugin(),
    new CleanWebpackPlugin(['dist']),
    new HtmlWebpackPlugin({
      template: './src/index.html'
    }),
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new ExtractTextPlugin({
      allChunks: true,
      filename: '[name]-[contenthash:8].css',
    }),
  ]
};

module.exports = config;