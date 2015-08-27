var webpack = require("webpack");
var path = require("path");
var ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
    resolve: {
        extensions: ["", ".js"]
    },
    entry: [
        "./entry.js"
    ],
    output: {
        path: path.resolve("./build/js/"),
        publicPath: "/build/js/",
        filename: "main.min.js"
    },
    module: {
        loaders: [
            {
                test: /\.sass$/,
                loader: ExtractTextPlugin.extract("style-loader",
                    "css?sourceMap!" +
                    "sass?indentedSyntax&sourceMap")
            },
            {
                test: /\.css$/,
                loader: ExtractTextPlugin.extract("style-loader", "css-loader")
            },
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                loader: 'babel?optional[]=runtime&stage=0'
            },
            { test: /\.json$/, loader: "json-loader"}
        ]
    },
    plugins: [
        //new webpack.DefinePlugin({
        //    "process.env": {
        //        NODE_ENV: JSON.stringify("production")
        //    }
        //}),
        //new webpack.optimize.DedupePlugin(),
        //new webpack.optimize.UglifyJsPlugin({
        //    compress: {
        //        warnings: false
        //    }
        //}),
        new ExtractTextPlugin("styles.css")
    ],
    devtool: "source-map"
};
