// DeprecationWarning: loaderUtils.parseQuery() received a non-string value which can be problematic, see https://github.com/webpack/loader-utils/issues/56
// parseQuery() will be replaced with getOptions() in the next major version of loader-utils
process.noDeprecation = true;

const path = require('path');
const Webpack = require('webpack');
const webpackConfig = require('./configs/webpack-prod.config.js');
const WORKSPACE = path.resolve(__dirname, '../');

Webpack(webpackConfig, function (err, stats) {
    if (err) {
        throw err;
    }

    process.stdout.write(stats.toString({
            colors: true,
            modules: false,
            children: false,
            chunks: false,
            chunkModules: false
        }) + '\n');

    if (stats.compilation.errors.length > 0) {
        process.exit(1);
    } else {
        process.exit(0);
    }
});
