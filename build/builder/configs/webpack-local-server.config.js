const path = require('path');
const config = require('./webpack-base.config.js');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const WORKSPACE = path.resolve(__dirname, '../../');

// rules
config.module.rules.forEach((rule)=> {
    if (String(rule.test) === String(/\.css$/)) {
        let styleLoaderIndex;

        rule.use.forEach((loader, index)=> {
            if (loader.loader === 'style-loader') {
                styleLoaderIndex = index;
            }
            if (loader.loader === 'css-loader') {
                loader.options.minimize = true;
            }
        });

        if (styleLoaderIndex > -1) {
            rule.use.splice(styleLoaderIndex, 1);
        }

        rule.use = ExtractTextPlugin.extract({
            fallback: 'style-loader',
            use: rule.use
        })
    }
});

// extract
config.plugins.push(new ExtractTextPlugin({
    filename: 'css/[name].css?[contenthash]',
    allChunks: true
}));
config.devtool = 'inline-source-map';
config.devServer = {
    // contentBase目录下的文件不会被proxy
    contentBase: path.join(WORKSPACE, 'builder'),
    host: 'localkandian.mp.qq.com',
    port: 8080,
    proxy: {
        '/page': {
            target: 'http://localkandian.mp.qq.com:8893',
            headers: {
                'host': 'localkandian.mp.qq.com',
                'x-request-type': 'debug'
            }
        },
        '/node/kandian/api': {
            target: 'http://localkandian.mp.qq.com:8893',
            pathRewrite: {
                '^/node/kandian/api': '/mock/api'
            },
            headers: {
                'host': 'localkandian.mp.qq.com',
                'x-request-type': 'debug'
            }
        },
        '/': {
            target: 'http://localkandian.mp.qq.com:8893',
            pathRewrite: {
                '^/(?!page)': '/mock/'
            },
            headers: {
                'host': 'localkandian.mp.qq.com'
            }
        }
    },
    disableHostCheck: true
};

module.exports = config;
