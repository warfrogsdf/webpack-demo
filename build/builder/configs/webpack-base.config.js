const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackCdnPlugin = require('html-webpack-cdn-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');
const WORKSPACE = path.resolve(__dirname, '../../');

// output
const OUTPUT_DIR = path.join(WORKSPACE, 'public/static/');
const OUTPUT_JS_DIR = 'js';
const OUTPUT_ASSETS_DIR = 'assets';

// loader
const SOURCE_DIR = path.join(WORKSPACE, 'src');
const SOURCE_ASSETS_DIR = path.join(SOURCE_DIR, 'assets');
const SOURCE_SHARED_DIR = path.join(WORKSPACE, 'kd-shared');

const pageConfigs = require('./pages.config.js');

let cdnConfig = {
    host: "//imgcache.qq.com/tencentvideo_v1/tvp/js",
    cdn: {
        js: "//imgcache.qq.com/tencentvideo_v1/tvp/js"
    },
    ext: ""
}
// entry
let entry = {};

// html plugin
let htmlPlugins = [];
const favicon = path.join(SOURCE_ASSETS_DIR, 'favicon.ico');

pageConfigs.forEach((pageConfig)=> {
    if (!pageConfig.name) {
        return;
    }

    let htmlOption = {
        filename: path.join('templates', pageConfig.filename),
        template: path.join(WORKSPACE, pageConfig.template),
        favicon: favicon
    };

    if (pageConfig.entry) {
        entry[pageConfig.name] = [path.join(WORKSPACE, pageConfig.entry)];

        htmlOption.chunks = [pageConfig.name];
        htmlOption.inject = true;
    } else {
        htmlOption.inject = false;
    }

    htmlPlugins.push(new HtmlWebpackPlugin(htmlOption));
});

module.exports = {
    context: WORKSPACE,
    entry: entry,
    output: {
        path: OUTPUT_DIR,
        publicPath: '/',
        filename: path.join(OUTPUT_JS_DIR, '[name].js'),
        chunkFilename: path.join(OUTPUT_JS_DIR, '[id].js')
    },
    module: {
        rules: [
            {
                test: require.resolve(path.join(SOURCE_DIR, 'lib/plugin/qrcode.js')),
                loader: 'exports-loader?QRCode'
            },{
                test:require.resolve(path.join(SOURCE_DIR,'common/locate.js')),
                loader: "expose-loader?areaList"
            },
            {
                test: require.resolve(path.join(SOURCE_DIR, 'lib/plugin/jquery.js')),
                use:[
                    {
                        loader:'expose-loader',
                        options:'$'
                    },
                    {
                        loader:'expose-loader',
                        options:'jQuery'
                    }
                ]
            },
            {
                test: /\.js?$/,
                include: [
                    SOURCE_ASSETS_DIR,
                    SOURCE_SHARED_DIR
                ],
                exclude: [
                    path.join(WORKSPACE, 'node_modules')
                ],
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            presets: ['es2015'],
                            plugins: ['transform-object-rest-spread', 'transform-remove-strict-mode']
                        }
                    }
                ]
            },
            {
                test: /\.css$/,
                use: [
                    {
                        loader: 'style-loader'
                    },
                    {
                        loader: 'css-loader',
                        options: {
                            importLoader: 1
                        }
                    },
                    {
                        loader: 'postcss-loader',
                        options: {
                            plugins: [
                                require('postcss-import')({
                                    addModulesDirectories: [path.join(WORKSPACE, 'src')],
                                    resolve: function (id, basedir) {
                                        // FIX 'addModulesDirectories' option not working bug in Windows 7
                                        if (/^common\/themes/.test(id)) {
                                            return path.resolve(WORKSPACE, 'src', id);
                                        }
                                        return path.resolve(basedir, id);
                                    }
                                }),
                                require('postcss-url'),
                                require('postcss-cssnext')
                            ]
                        }
                    }
                ]
            },
            {
                test: /\.html$/,
                use: [
                    {
                        loader: 'html-loader'
                    }
                ]
            },
            {
                test: /\.(png|jpe?g|gif|svg|webp)(\?.*)?$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            name: path.join(OUTPUT_ASSETS_DIR, '[name].[hash:7].[ext]'),
                            limit: 5000
                        }
                    }
                ]
            },
            {
                test: /\.(woff|woff2|ttf|eot)/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            name: path.join(OUTPUT_ASSETS_DIR, '[name].[hash:7].[ext]'),
                            limit: 10000
                        }
                    }
                ]
            }
        ]
    },
    resolve: {
        alias: {
            'common': path.join(SOURCE_DIR, 'common'),
            'assets': path.join(SOURCE_DIR, 'assets'),
            'base': path.join(SOURCE_DIR, 'assets/base'),
            'lib': path.join(SOURCE_DIR, 'lib'),
            'widget': path.join(SOURCE_DIR, 'lib/widget'),
            'plugin': path.join(SOURCE_DIR, 'lib/plugin'),
            'jquery':path.join(SOURCE_DIR, 'lib/plugin/jquery'),
            'util': path.join(SOURCE_DIR, 'common/util'),
            'tvp$': path.join(SOURCE_DIR, 'lib/plugin/tvp.player_v2_jq.js'),
            'async-import': path.join(WORKSPACE, 'node_modules/scriptjs/dist/script.js'),
            'kd-shared': SOURCE_SHARED_DIR,
            'zepto$': path.join(SOURCE_DIR, 'lib/plugin/jquery.js'),
        }
    },
    externals: {
        'pt_logout': 'pt_logout',
        'UE': 'UE'
    },
    plugins: [
        new ManifestPlugin({
            fileName:"webpack-manifest.json"
        }),
        new webpack.ProvidePlugin({
            $: path.join(SOURCE_DIR, 'lib/plugin/jquery.js'),
            jQuery: path.join(SOURCE_DIR, 'lib/plugin/jquery.js'),
            Promise: 'es6-promise-promise',
            Backbone: path.join(SOURCE_DIR, 'lib/backbone.js'),
            _: 'underscore'
        }),
        new webpack.LoaderOptionsPlugin({
            options: {
                customInterpolateName: function (url, name, options) {
                    return url.replace(/\\/g, '/');
                }
            }
        }),
        new HtmlWebpackCdnPlugin(cdnConfig),
    ].concat(htmlPlugins)
};
