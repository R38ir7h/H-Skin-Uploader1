const CssNano = require('cssnano');
const { resolve } = require('path');
const { mapValues } = require('lodash');
const TerserPlugin = require('terser-webpack-plugin');
/** @type {new () => any} */
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const ManifestPlugin = require('webpack-manifest-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const GoogleFontsPlugin = require('google-fonts-plugin');
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin');

const { _moduleAliases: aliases } = require('./package.json');

/** Псевдонимы проекта. */
let alias = mapValues(aliases, value => resolve(__dirname, value));

// @ts-ignore
module.exports = (env, { mode }) => ([
    {
        mode,
        devtool: (mode !== 'production') ? 'eval-source-map' : false,
        entry: {
            main: './src/frontend/main.js',
        },
        output: {
            path: resolve('dist'),
            publicPath: '/dist/',
          filename: '[name].js',
        },
        stats: {
            hash: false,
            version: false,
            timings: true,
            children: false,
            errorDetails: false,
            entrypoints: false,
            performance: mode === 'production',
            chunks: false,
            modules: false,
            reasons: false,
            source: false,
            publicPath: false,
            builtAt: false,
        },
        performance: {
            hints: (mode === 'production') ? 'warning' : false,
        },
        module: {
            rules: [
                {
                    test: /\.vue$/,
                    use: [
                        'cache-loader',
                        'vue-loader',
                    ],
                },
                {
                    test: /\.js$/,
                    loader: 'babel-loader',
                    options: {
                        cacheDirectory: true,
                        // https://habr.com/ru/post/425215/
                        presets: [
                            [
                                '@babel/preset-env',
                                {
                                    exclude: [
                                        'transform-async-to-generator',
                                        'transform-regenerator',
                                    ], 
                                    loose: true,
                                },
                            ],
                        ],
                        plugins: [
                            [
                                'module:fast-async',
                                {
                                    spec: true,
                                },
                            ],
                        ],
                    },
                },
                {
                    test: /\.css$/,
                    use: [
                        'vue-style-loader',
                        'cache-loader',
                        'css-loader',
                    ],
                },
                {
                    test: /\.less$/,
                    use: [
                        'vue-style-loader',
                        'cache-loader',
                        'css-loader',
                        'less-loader',
                    ],
                },
                {
                    test: /\.scss$/,
                    use: [
                        MiniCssExtractPlugin.loader,
                        'cache-loader',
                        'css-loader',
                        'sass-loader',
                    ],
                },
                {
                    test: /\.(gif|png|jpe?g|svg|webp)$/,
                    use: [
                        'cache-loader',
                        {
                            loader: 'file-loader',
                            options: {
                                outputPath: 'images',
                                name: '[contenthash].[ext]',
                            },
                        },
                    ],
                },
                {
                    test: /\.(woff|woff2|eot|ttf|otf)$/,
                    use: [
                        'cache-loader',
                        {
                            loader: 'file-loader',
                            options: {
                                outputPath: 'fonts',
                                name: '[contenthash].[ext]',
                            },
                        },
                    ],
                },
                {
                  test: /\.pug$/,
                  loader: ['pug-plain-loader'],
                },
            ],
        },
        resolve: {
            alias,
            extensions: [
                '.js',
                '.vue',
                '.css',
                '.sass',
                '.scss',
                '.less',
            ],
        },
        optimization: {
            minimize: mode === 'production',
            minimizer: [
                new TerserPlugin({
                    cache: true,
                    parallel: true,
                    terserOptions: {
                        compress: {
                            drop_console: true,
                        },
                        output: {
                            comments: false,
                        },
                    },
                }),
            ],
            splitChunks: {
                chunks: 'all',
            },
            runtimeChunk: true,
            moduleIds: 'hashed',
            mangleWasmImports: true,
        },
        plugins: [
            new GoogleFontsPlugin({
                "fonts": [
                    {
                        "family": "Roboto",
                        "variants": [
                            "100",
                            "200",
                            "300",
                            "400",
                        ],
                        "subsets": [
                            "latin",
                            "cyrillic"
                        ]
                    }
                ],
                "formats": [
                    "woff",
                ]
            }),
            new VueLoaderPlugin(),
            new OptimizeCSSPlugin({
                cssProcessor: CssNano,
                cssProcessorPluginOptions: {
                    preset: [
                        'default',
                        {
                            discardComments: {
                                removeAll: true,
                            },
                        },
                    ],
                },
                canPrint: true,
            }),
            new MiniCssExtractPlugin({
                filename: 'css/[name].css?[contenthash]',
                chunkFilename: 'css/[name].css?[contenthash]',
                ignoreOrder: false,
            }),
            new ManifestPlugin(),
        ],
    },
]);
