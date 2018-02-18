const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ImageminPlugin = require('imagemin-webpack-plugin').default;
const CopyWebpackPlugin = require('copy-webpack-plugin');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

const extractSass = new ExtractTextPlugin({
    filename: "css/[name]-[hash].css",
    disable: process.env.NODE_ENV === "development"
});

module.exports = {
    watch: false,
    entry: ['./_src/js/index.js', './_src/scss/theme.scss'],
    output: {
        filename: '[name]-[hash].bundle.js',
        path: path.resolve('assets'),
        publicPath: '/assets/'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                }
            },
            {
                test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 10000,
                            mimetype: 'image/svg+xml',
                            name: 'img/[name].[ext]',
                            publicPath: '../'
                        }
                    },
                    {
                        loader: 'svg-fill-loader'
                    }
                ]
            },
            {
                test: /\.(css|scss)$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: [
                        { loader: 'css-loader', options: { importLoaders: 1 } },
                        {
                            loader: 'svg-fill-loader/encodeSharp'
                        },
                        {
                            loader: 'postcss-loader',
                            options: {
                                config: {
                                    path: 'postcss.config.js'
                                }
                            }
                        },
                        { loader: 'sass-loader'}
                    ]
                })
            },
            {
                test: /.(ttf|otf|eot|woff(2)?)(\?[a-z0-9]+)?$/,
                use: [{
                    loader: 'file-loader',
                    options: {
                        name: '[name].[ext]',
                        outputPath: 'fonts/',    // where the fonts will go
                        publicPath: '../'       // override the default path
                    }
                }]
            },
            {
                test: /\.(jpe?g|png|gif)$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 8000,
                            name: 'img/[name].[ext]',
                            publicPath: '../'
                        }
                    }
                ]
            }
        ]
    },
    resolveLoader: {
        modules: ['node_modules', path.resolve(__dirname, 'loaders')]
    },
    resolve: {
        modules: [
            'node_modules'
        ]
    },
    plugins: [
        new CleanWebpackPlugin(['assets'], { root: path.resolve(__dirname), verbose: true }),
        extractSass,
        new ImageminPlugin({ test: /\.(jpe?g|png|gif|svg)$/i }),
        new HtmlWebpackPlugin({
            template: '_src/template/default.html',
            filename: '../_layouts/default.html'
        }),
        new CopyWebpackPlugin([{
            from: path.resolve('_src/img'),
            to: 'img/'
        }]),
        new FaviconsWebpackPlugin({
            logo: './_src/img/logo.svg?fill=blue',
        }),
        new UglifyJSPlugin()
    ]
};
