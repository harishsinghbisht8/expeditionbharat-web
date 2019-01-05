const webpack = require("webpack");
const nodeExternals = require("webpack-node-externals");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const path = require("path");

module.exports = {
  target: "node",

  externals: [nodeExternals()],

  /**
   * entry tells webpack where to start looking.
   */ 
  entry: {
    server: path.resolve(__dirname, "..", "server.js")
  },
  /**
   * output tells webpack where to put the files he creates
   * after running all its loaders and plugins.
   */
  output: {
    filename: "webpack.[name].js",
    path: path.resolve(__dirname, "../compiled"),
    publicPath: "/",
    library: "app",
    libraryTarget: "commonjs2"
  },

  module: {
    // Loaders allow you to preprocess files!
    rules: [
      {
        test: /\.(js)$/, // look for .js files
        loader: require.resolve(
          path.resolve(__dirname, "loaders/remove-hashbag-loader")
        ),
        include: /node_modules/ // include /node_modules
      },
      {
        test: /\.(js)$/, // look for .js files
        exclude: /node_modules/, // ingore /node_modules
        loaders: ["babel-loader"]
      },
      {
        test: /\.(less|css)$/,
        loaders: ExtractTextPlugin.extract({
          fallback: "style-loader",
          use: "css-loader!less-loader"
        })
      }
    ]
  },

  resolve: {
    extensions: [".js"],
    alias: {
      "reactify-core": path.resolve(
        __dirname,
        "../app_react/views/react_core"
      ),
      "preact-router": path.resolve(
        __dirname,
        "../public/js/lib/preact-router.js"
      )
    }
  },

  plugins: [
    new ExtractTextPlugin({
      filename: "eb.[name].css"
    })
  ],

  stats: { colors: true },

  node: {
    global: true,
    process: false,
    Buffer: false,
    __filename: false,
    __dirname: false,
    setImmediate: false
  }
};
