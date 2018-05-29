const path = require('path');

const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CompressionWebpackPlugin = require('compression-webpack-plugin');

const config = require('./webpack-base.config.js');
const pageConfigs = require('./pages.config');

const WORKSPACE = path.resolve(__dirname, '../../');

// output
config.output.publicPath = '//mp.gtimg.cn/kdmp/static/';
config.output.filename = config.output.filename + '?[chunkhash]';
config.output.chunkFilename = config.output.chunkFilename + '?[chunkhash]';

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

// env plugin
config.plugins.unshift(new webpack.DefinePlugin({
    'process.env': {
        NODE_ENV: '"production"'
    }
}));

// common chunks
config.plugins.push(new webpack.optimize.CommonsChunkPlugin({
    name: 'vendor',
    minChunks: function (module) {
        return (module.resource && /\.js$/.test(module.resource) && module.resource.indexOf(path.join(WORKSPACE, 'node_modules')) === 0);
    }
}));

// webpack runtime and module manifest
// prevent vendor hash from being updated whenever entry bundle is updated
config.plugins.push(new webpack.optimize.CommonsChunkPlugin({
    name: 'meta',
    chunks: ['vendor']
}));

let allEntryChunks = [];
pageConfigs.forEach((pageConfig)=> {
    if (pageConfig.entry && pageConfig.hasCommonModule !== false) {
        allEntryChunks.push(pageConfig.name);
    }
});

config.plugins.push(new webpack.optimize.CommonsChunkPlugin({
    name: 'vendor.lib',
    chunks: allEntryChunks,
    minChunks: function (module) {
        return (module.resource && /\.js$/.test(module.resource) && module.resource.indexOf(path.join(WORKSPACE, 'src/lib')) === 0);
    }
}));

config.plugins.push(new webpack.optimize.CommonsChunkPlugin({
    name: 'vendor.base',
    chunks: allEntryChunks,
    minChunks: function (module) {
        return (module.resource && /\.js$/.test(module.resource) && module.resource.indexOf(path.join(WORKSPACE, 'src/assets/base')) === 0);
    }
}));

config.plugins.push(new webpack.optimize.CommonsChunkPlugin({
    name: 'vendor.common',
    chunks: allEntryChunks,
    minChunks: function (module) {
        return (module.resource && /\.js$/.test(module.resource) && module.resource.indexOf(path.join(WORKSPACE, 'src/common')) === 0);
    }
}));

config.plugins.push(new webpack.optimize.CommonsChunkPlugin({
    name: 'style.ui',
    chunks: allEntryChunks,
    minChunks: function (module) {
        return (module.resource && /\.css$/.test(module.resource) && module.resource.indexOf(path.join(WORKSPACE, 'src/common/themes/modern/common/common')) === 0);
    }
}));

config.plugins.push(new webpack.optimize.CommonsChunkPlugin({
    name: 'style.common.layout',
    chunks: allEntryChunks,
    minChunks: function (module) {
        let layout=["src/common/themes/modern/common/header","src/common/themes/modern/common/widget","src/common/themes/modern/common/appmsg.import"]
        let ret=false;
        for(let i=0;i<layout.length;i++ ){
            if(module.resource && /\.css$/.test(module.resource) && module.resource.indexOf(path.join(WORKSPACE, layout[i])) === 0){
                ret=true;
                break;
            }
        }
        return ret;
    }
}));

config.plugins.push(new webpack.optimize.CommonsChunkPlugin({
    name: 'style.common',
    chunks: allEntryChunks,
    minChunks: function (module) {
        return (module.resource && /\.css$/.test(module.resource) && module.resource.indexOf(path.join(WORKSPACE, 'src/common/themes/modern/common')) === 0);
    }
}));

config.plugins.push(new webpack.optimize.CommonsChunkPlugin({
    name: 'style.common.other',
    chunks: allEntryChunks,
    minChunks: function (module) {
        return (module.resource && /\.css$/.test(module.resource) && module.resource.indexOf(path.join(WORKSPACE, 'src/common/themes')) === 0);
    }
}));

// extract
config.plugins.push(new ExtractTextPlugin({
    filename: 'css/[name].css?[contenthash]',
    allChunks: true
}));

// uglify
config.plugins.push(new webpack.optimize.UglifyJsPlugin({
    compress: {
        warnings: false
    },
    sourceMap: true
}));

// html plugin

function isCommonHtmlModule(chunks) {
    if (Object.prototype.toString.call(chunks) !== '[object Array]') {
        return false;
    }
    for (let i = 0, length = chunks.length; i < length; i++) {
        if (allEntryChunks.indexOf(chunks[i]) > -1) {
            return true;
        }
    }
    return false;
}

// html plugin
config.plugins.forEach((plugin)=> {
    if (!(plugin instanceof HtmlWebpackPlugin)) {
        return;
    }
    plugin.options.filename = path.join('../', plugin.options.filename);

    plugin.options.minify = {
        removeComments: true,
        collapseWhitespace: false,
        removeAttributeQuotes: false
    };

    plugin.options.chunksSortMode = 'dependency';

    if (Object.prototype.toString.call(plugin.options.chunks) === '[object Array]') {
        if (isCommonHtmlModule(plugin.options.chunks)) {
            let commonEntryChunks = ['meta', 'vendor', 'vendor.lib', 'vendor.base', 'vendor.common', 'style.ui','style.common.layout','style.common','style.common.other'];
            Array.prototype.unshift.apply(plugin.options.chunks, commonEntryChunks);

            plugin.options.chunksSortMode = function (previous, current) {
                let previousIndex = commonEntryChunks.indexOf(previous.names[0]),
                    currentIndex = commonEntryChunks.indexOf(current.names[0]);

                if (currentIndex === -1) {
                    return -1;
                }

                if (previousIndex === -1) {
                    return 1;
                }

                return previousIndex - currentIndex;
            };
        }
        else {
            Array.prototype.unshift.apply(plugin.options.chunks, ['meta', 'vendor']);
        }
    }
});

// gzip
config.plugins.push(new CompressionWebpackPlugin({
    asset: '[path].gz?[query]',
    algorithm: 'gzip',
    test: /\.(js|css|html)(\?\w+)?$/,
    threshold: 10240,
    minRatio: 0.8
}));

// source-map
config.devtool = process.env.NODE_ENV === 'test' ? 'source-map' : 'hidden-source-map';

module.exports = config;
