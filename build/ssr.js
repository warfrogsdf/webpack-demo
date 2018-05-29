// DeprecationWarning: loaderUtils.parseQuery() received a non-string value which can be problematic, see https://github.com/webpack/loader-utils/issues/56
// parseQuery() will be replaced with getOptions() in the next major version of loader-utils

const Webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const path = require('path');
const opn = require('opn');

const webpackConfig = require('./webpack.config');

const port = webpackConfig.devServer.port;

const url = `http://127.0.0.1:${port}`;

// entry live reloading
for (let name in webpackConfig.entry) {
  webpackConfig.entry[name].unshift(`webpack-dev-server/client?${url}`, 'webpack/hot/dev-server');
  //webpackConfig.entry[name].unshift(`webpack-hot-middleware/client?${url}`);
}

const compiler = Webpack(webpackConfig);
// webpack dev server
const server = new WebpackDevServer(compiler, Object.assign({
  stats: {
    colors: true,
    chunks: true
  }
}, webpackConfig.devServer));

server.listen(port, '127.0.0.1', function (err) {
  if (err) {
    console.error(err);
    return;
  }
  opn(url);
});
