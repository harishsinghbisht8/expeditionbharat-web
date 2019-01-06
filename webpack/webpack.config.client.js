const webpack = require("webpack");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;
const TextReplacePlugin = require("./plugins/textReplacePlugin");
const EjsPlugin = require("./plugins/ejsPlugin");
const workboxPlugin = require("workbox-webpack-plugin");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const ChunkFileListPlugin = require("./plugins/chunkFileList");
const path = require("path");
const node_env = process.env.NODE_ENV || "dev";
const isDev = node_env === "dev";
const config = require("../config/config")[node_env];
const ifNotDev = plugin => (!isDev ? plugin : undefined);
const removeEmpty = array => array.filter(plugin => !!plugin);
const outputPath = path.resolve(__dirname, "../public/js/dist");
const CompressionPlugin = require("compression-webpack-plugin");
const BrotliPlugin = require("brotli-webpack-plugin");

module.exports = (env = {}) => {
    return {
    target: "web",
    /**
     * entry tells webpack where to start looking.
     */
    entry: {
        app: path.resolve(__dirname, "../app_react/views/common/js/app.js"),
        polyfill: ['core-js/es6/promise', 'core-js/fn/object/assign', 'core-js/fn/string/includes'],
        common: [
            "preact",
            "preact-router",
            "preact-async-route",
            "reactify-core"
        ],
    },
    /**
     * output tells webpack where to put the files it creates
     * after running all its loaders and plugins.
     */
    //devtool: 'source-map',
    
    output: {
        filename: isDev ? "eb.[name].js" : "eb.[name].[chunkhash].js",
        path: outputPath,
        publicPath: '/js/dist/',
        chunkFilename: isDev ? "eb.[name].js" : "eb.[name].[chunkhash].js",
    },

    module: {
        // Loaders allow you to preprocess files!
        rules: [
            {
                test: /\.(js)$/, // look for .js files
                loader: require.resolve(path.resolve(__dirname, "loaders/remove-hashbag-loader")),
                include: /node_modules/ // include /node_modules
            },
            {
                test: /\.(js)$/, // look for .js files
                exclude: /node_modules/, // ingore /node_modules
                loaders: ["babel-loader"]
            },
            {
                test: /\.(less|css)$/,
                loaders: [
                    {loader: "style-loader"},
                    {loader: "css-loader", options: {
                        minimize: true
                    }},
                    {loader: "less-loader"}],
            }
        ]
    },

    resolve: {
        extensions: [".js"],
        alias: {
            "reactify-core": path.resolve(__dirname, "../app_react/views/react_core/index.js"),
            "preact-router": path.resolve(__dirname, "../public/js/lib/preact-router.js")
        }
    },

    plugins: removeEmpty([
        new CleanWebpackPlugin(["dist/*.*"], {
            root: path.resolve(__dirname, "../public/js")
        }),
        new workboxPlugin.InjectManifest({
            swSrc: path.resolve(__dirname, "../service-worker-raw.js"),
            swDest: path.resolve(__dirname,  "../service-worker-nm.js"),
            chunks: ['runtime'],
            exclude: [/\.css$/]
        }),
        ifNotDev(
            new CompressionPlugin({
                asset: "[path].gz[query]",
                algorithm: "gzip",
                test: /\.js$/,
                threshold: 0,
            })
        ),
        ifNotDev(
            new BrotliPlugin({
                asset: "[path].br[query]",
                test: /\.js$/,
                threshold: 0,
                minRatio: 0,
            })
        ),
        new TextReplacePlugin({
            template: path.resolve(__dirname, "../app_react/views/common/templates/index.ejs"),
            styles: path.resolve(__dirname, "../public/css/eb.home.css"),
            replaceString: "PAGE_STYLES",
            outputFilename: 'index_compiled.ejs'
        }),
        new webpack.HashedModuleIdsPlugin(),
        new webpack.optimize.CommonsChunkPlugin({
            name: "common",
            minChunks: Infinity
        }),
        new webpack.optimize.CommonsChunkPlugin({
            name: "runtime"
        }),
        new ChunkFileListPlugin({
            filename: 'chunkFileList.json',
            path: outputPath
        }),
        new BundleAnalyzerPlugin({
            // In `static` mode single HTML file with bundle report will be generated.
            analyzerMode: "static",
            defaultSizes: "parsed",
            reportFilename: "./reports-index.html",
            openAnalyzer: false
        }),
        // Only running UglifyJsPlugin() if not local env
        ifNotDev(
            new UglifyJsPlugin({
                parallel: 4,
                sourceMap: false,
                uglifyOptions: {
                    ie8: false
                }
            })
        ),
    ]),

    stats: { colors: true },

    node: {
        global: true,
        process: false,
        Buffer: false,
        __filename: false,
        __dirname: false,
        setImmediate: false,
        fs: "empty",
        child_process: "empty",
        module: "empty",
        net: "empty",
        tls: "empty"
    }
}
};
