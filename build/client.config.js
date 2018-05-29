const webpack = require('webpack')
const merge = require('webpack-merge')
const baseConfig = require('./webpack.base.config.js')
const VueSSRClientPlugin = require('vue-server-renderer/client-plugin')
const WriteFilePlugin = require('write-file-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

module.exports = merge(baseConfig, {
  entry: {
    main: [`webpack-dev-server/client?http://127.0.0.1:9000/`, './src/entry-client.js', ],
  },
  output: {
    publicPath: 'http://127.0.0.1:9000/'
  },
  devtool: "cheap-eval-source-map",
  plugins: [
    new webpack.optimize.CommonsChunkPlugin({
      name: "commons",
      // ( 公共chunk(commnons chunk) 的名称)

      //filename: "[name]-[chunkhash:8].js",
      filename: "[name].js",
    }),
    new WriteFilePlugin({
        // Write only files that have ".css" extension.
        test: /^(vue-ssr-client-manifest\.json|index\.html)$/
      }),
    // new UglifyJsPlugin(),
    // 重要信息：这将 webpack 运行时分离到一个引导 chunk 中，
    // 以便可以在之后正确注入异步 chunk。
    // 这也为你的 应用程序/vendor 代码提供了更好的缓存。
    new webpack.optimize.CommonsChunkPlugin({
      name: "manifest",
      minChunks: Infinity
    }),
    // 此插件在输出目录中
    // 生成 `vue-ssr-client-manifest.json`。
    new VueSSRClientPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('development'),
      'process.env.VUE_ENV': '"client"'
    })
  ]
})