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
// const ManifestPlugin = require('webpack-manifest-plugin'); 生成一个资源对象，键名为打包前资源名称，键值为打包后资源名称
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
    /*//TODO js标准库s单独打一个包--jq单独引用吧
     map['vendor'] = [
     path.resolve(__dirname, 'src', 'dep', '标准库.js')
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
            conf.chunks = ['manifest', 'vendor', fileName];
        } else {
            conf.inject = 'body';
            conf.chunks = ['manifest', 'vendor'];
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
                            /*removeComments: false,
                            collapseWhitespace: false*/
                        }
                    }]
                }
            ]
        },
        plugins: env ?
            [
                new webpack.DefinePlugin({
                    'ENV': JSON.stringify('dev')
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
                    'ENV': JSON.stringify('production')
                }),

                new webpack.optimize.CommonsChunkPlugin({
                    name: "vendor",
                    filename: "js/vendor-[chunkhash].js",
                    minChunks: function (module, count) {
                        if (module.resource && (/^.*\.(css|less|scss)$/).test(module.resource)) {
                            return false;
                        }
                        return module.context && module.context.indexOf("node_modules") !== -1 || count >= 2;
                    },
                    hash: true
                }),
                new webpack.optimize.UglifyJsPlugin({
                    compress: {
                        warnings: false,
                        drop_console: true,
                        pure_funcs: ['console.log']
                    },
                    parallel: true,  //开启多线程
                    sourceMap: false,
                    output: {
                        comments: false
                    },
                    mangle: {
                        except: ['$', 'exports', 'require']
                    }
                }),
                new webpack.HashedModuleIdsPlugin(), //以模块相对路径生成模块标识，将id转换成四位编码--防止更改入口文件顺序引起的文件打包后hash的更改
                //如果更改入口文件的话（不包括入口文件中引用的文件,当然这么说就是改入口文件引用的文件会更新vendor，因为这部分是直接打到vendor里边的会造成vendor内容的更改）只会更新manifest文件的hash不会更改vendor的hash
                new webpack.optimize.CommonsChunkPlugin({
                    name: 'manifest',
                    chunks: ['vendor']
                }),
                cssExtractTextPlugin,
                //正式环境下压缩css，只能合并属性，优化z-index等(当然gulp压缩也ok) 注： 开发环境不可以压缩--会影响sourceMap文件
                new OptimizeCssAssetsPlugin({
                    assetNameRegExp: /\.css$/g,
                    cssProcessor: require('cssnano'),
                    cssProcessorOptions: {discardComments: {removeAll: true}},
                    canPrint: true
                }),
                new BundleAnalyzerPlugin()
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