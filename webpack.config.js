var path = require("path");
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var VueLoaderPlugin = require('vue-loader/lib/plugin'); //vue-loader 15.* 以后需要引入


var config = {
    entry: {
        main: './main.js'
    },
    output: {
        path: path.join(__dirname, './dist'),
        publicPath: '/dist/',
        filename: 'main.js',
    },
    /*模块处理配置*/
    module: {
        /*处理规则*/
        rules: [{
                test: /\.vue$/,
                loader: 'vue-loader',
                options: {
                    loaders: {
                        css: ExtractTextPlugin.extract({
                            use: 'css-loader',
                            fallback: 'vue-style-loader'
                        })
                    }
                }
            }, {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /node_modules/
            }, {
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    use: 'css-loader',
                    fallback: 'style-loader'
                })
            },
            {
                test: /\.(gif|jpg|png|woff|svg|eot|ttf)\??.*$/,
                loader: 'url-loader?limit=1024'
            }
        ]
    },
    plugins: [
        /* 提取整合 css 文件 */
        // new ExtractTextPlugin("main.css"),
        new VueLoaderPlugin(), //vue-loader 15.* 以后需要引入
        new ExtractTextPlugin({
            filename: '[name].css',
            allChunks: true
        })
    ],
}

module.exports = config;