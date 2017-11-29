/**
 * Created by humorHan on 2017/11/22.
 */
const path = require('path');
const glob = require('glob');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const webpack = require('webpack');

const distDir = path.resolve(__dirname, 'dist');
const jsDir = path.resolve(__dirname, 'src', 'js');
const htmlDir = path.resolve(__dirname, 'src', 'html');
const imgDir = path.resolve(__dirname, 'src', 'img');
const tplDir = path.resolve(__dirname, 'src', 'tpl');
const componentDir = path.resolve(__dirname, 'src', 'dep', 'component');
const depDir = path.resolve(__dirname, 'src', 'dep');
const scssDir = path.resolve(__dirname, 'src', 'scss');
const node_modules = path.resolve(__dirname, 'node_modules');

//入口文件
let entries = (function () {
    let entryJs = glob.sync(jsDir + '/*.js');
    let map = {};
    entryJs.forEach(function (filePath) {
        let fileName = filePath.substring(filePath.lastIndexOf('\/') + 1, filePath.lastIndexOf('.'));
        map[fileName] = filePath;
    });
    /*TODO 公共js单独打一个包
     map['vendor'] = [
     path.join(__dirname, 'js', 'common', 'base')
     ];*/
    return map;
})();

//HTML
let htmlPlugin = (function () {
    let entryHtml = glob.sync(htmlDir + '/**/*.html');
    let tempArr = [];
    entryHtml.forEach(function (filePath) {
        let fileName = filePath.substring(filePath.lastIndexOf('\/') + 1, filePath.lastIndexOf('.'));
        let conf = {
            template: filePath,
            filename: './html/' + fileName + '.html'
        };
        if (fileName in entries) {
            conf.inject = 'body';
            conf.chunks = ['vendor', fileName];
        } else {
            conf.inject = 'body';
            conf.chunks = ['vendor'];
            console.error('没有匹配到和html(' + fileName + ')相同文件名的js,请检查!');
            //throw new Error('没有匹配到和html相同文件名的js,请检查!');
        }
        conf.chunksSortMode = 'manual';
        tempArr.push(new HtmlWebpackPlugin(conf));
    });
    return tempArr;
})();

/**
 * webpack配置文件
 * @param env   环境
 * @param argv  webpack配置等
 */
module.exports = function (env, argv) {
    let cssExtractTextPlugin = new ExtractTextPlugin({
        filename: env ? 'css/[name].css' : 'css/[name]-[contenthash].css',
        disable: false,
        allChunks: false
    });
    return {
        cache: !!env,
        watch: !!env,
        watchOptions: {
            ignored: /node_modules/,
        },
        devtool: env ? 'inline-source-map' : false,
        entry: entries,
        output: {
            path: distDir,
            publicPath: env ? '/dist/' : '../',
            //publicPath: env ? '/dist/' : '/perfectWebpack/dist/',
            filename: env ? "js/[name].js" : "js/[name]-[chunkhash].js",
            chunkFilename: env ? "js/[name]-chunk.js" : "js/[name]-chunk-[chunkhash].js",
            pathinfo: !!env,
            library: "humorHan",
            libraryTarget: "umd"
        },
        resolve: {
            modules: [depDir, scssDir, tplDir, node_modules],
            extensions: ['.js', '.scss'],
            alias: {
                'jquery$': path.resolve(__dirname, 'src', 'dep', 'jquery-3.1.1.min.js') //$代表精确查找
            }
        },
        module: {
            noParse: function (content) {
                return /jquery|lodash/.test(content);
            },
            rules: [
                {
                    test: /\.(woff|woff2|eot|ttf|otf)$/,
                    use: 'url-loader'
                }, {
                    test: /\.scss$/,
                    use: env ? [{
                        loader: "style-loader"
                    }, {
                        loader: "css-loader",
                        options: {
                            sourceMap: true
                        }
                    }, {
                        loader: 'postcss-loader'
                    }, {
                        loader: "sass-loader",
                        options: {
                            includePaths: [scssDir, componentDir]
                        }
                    }] : cssExtractTextPlugin.extract({
                        use: [{
                            loader: "css-loader"
                        }, {
                            loader: 'postcss-loader'
                        }, {
                            loader: "sass-loader",
                            options: {
                                includePaths: [scssDir, componentDir]
                            }
                        }]
                    })
                }, {
                    test: /\.tpl$/,
                    include: [tplDir, componentDir],
                    loader: 'art-template-loader'
                }, {
                    test: /\.(png|jpeg|jpg|gif)$/,
                    //use: env ? 'url-loader?limit=100&name=img/[name].[ext]' : 'url-loader?limit=100&name=img/[name].[ext]?v=[hash:8]'
                    include: [imgDir, componentDir],
                    use: [{
                        loader: 'url-loader',
                        options: {
                            limit: 1,
                            name: env ? 'img/[name].[ext]' : 'img/[name].[ext]?v=[hash:8]'
                        }
                    }]
                }, {
                    test: /\.js$/,
                    include: [jsDir, depDir],
                    use: {
                        loader: 'babel-loader',
                        options: {
                            presets: ['env'],
                            plugins: ['transform-runtime']
                        }
                    }
                }, {
                    test: /\.(html|php)$/,
                    include: [htmlDir],
                    use: [{
                        loader: 'html-loader',
                        options: env ? {} : {
                            minimize: true,
                            removeComments: false,
                            collapseWhitespace: false
                        }
                    }]
                }
            ]
        },
        plugins: env ?
            [
                new webpack.DefinePlugin({
                    'env': JSON.stringify('dev')
                }),
                new webpack.optimize.CommonsChunkPlugin({
                    name: "vendor",
                    filename: "js/vendor.js",
                    minChunks: function (module) {
                        return (
                            module.resource &&
                            /\.js$/.test(module.resource) &&
                            module.resource.indexOf(node_modules) !== -1
                        )
                    }
                }),
                cssExtractTextPlugin,
                new webpack.NamedModulesPlugin(),
                new webpack.HotModuleReplacementPlugin(),
            ].concat(htmlPlugin) : [
                new CleanWebpackPlugin(distDir),
                new webpack.DefinePlugin({
                    'env': JSON.stringify('production')
                }),
                new webpack.optimize.CommonsChunkPlugin({
                    name: "vendor",
                    filename: "js/vendor-[hash].js",
                    /* TODO 是数值的话，每个有模板引入的入口文件都有art-template的runtime.js，函数的话引入多次的库没有办法打包到vendor文件
                     minChunks: function (module) {
                     if(module.resource && (/^.*\.(css|scss)$/).test(module.resource)) {
                     return false;
                     }
                     return module.context && module.context.indexOf("node_modules") !== -1;
                     },*/

                    minChunks: 5,
                    hash: true
                }),
                //TODO 我认为不需要!!!
                /* 不明白很多配置都有如下代码，我要跟风？显然不能！
                 如果没有manifest配置的话，每次打包后vendor的hash都会更改，但是存在hash的情况是线上版本，而每次更新线上基本上必然是有js
                 的更改包括增加等，那么对应runtime管理必然更改，既然更改了那么就是希望hash改变的，所以压根不用做如下操作。
                 如果非要说那么写如下代码的意义的话，那么应该是： js css没有增加，只是解决了一点bug比如更改了一点js代码，
                 这样的话希望对于管理runtime是没有更改的，也就是说线上希望得到一个hash没有改变的manifest 和一个更改hash的vendor或者js文件
                 那么这种情况又有多少呢？？？
                 注意 如果做以下操作，需要配合new webpack.HashedModuleIdsPlugin()一起，否则hash一直不更改就不好了
                 new webpack.optimize.CommonsChunkPlugin({
                 name: 'manifest',
                 chunks: ['vendor']
                 }),*/
                new BundleAnalyzerPlugin(),
                new webpack.optimize.UglifyJsPlugin({
                    compress: {
                        warnings: false,
                        drop_console: true,
                        pure_funcs: ['console.log']
                    },
                    sourceMap: false,
                    output: {
                        comments: false
                    },
                    mangle: {
                        except: ['$', 'exports', 'require']
                    }
                }),
                cssExtractTextPlugin,
                //正式环境下压缩css，只能合并属性，优化z-index等(当然gulp压缩也ok) 注： 开发环境不可以压缩--会影响sourceMap文件
                new OptimizeCssAssetsPlugin({
                    assetNameRegExp: /\.css$/g,
                    cssProcessor: require('cssnano'),
                    cssProcessorOptions: {discardComments: {removeAll: true}},
                    canPrint: true
                })
            ].concat(htmlPlugin),
        devServer: env ? {
            /*proxy: { // proxy URLs to backend development server
             '/api': 'http://localhost:3000'
             },*/
            port: 9000,
            clientLogLevel: "none",
            contentBase: false,
            compress: true,
            //historyApiFallback: true, // true for index.html upon 404, object for multiple paths
            hot: true,
            https: false,
            noInfo: true,
            open: true,
            openPage: './dist/html/index.html'
        } : {},
        externals: {
            'jquery': '$'
        }
    }
};