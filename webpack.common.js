import webpack from "webpack";
import path from "path";
import ExtractTextPlugin from "extract-text-webpack-plugin";

export default {
    resolve: {
        extensions: ["", ".js"]
    },
    entry: [
        "./entry.js"
    ],
    output: {
        path: path.resolve("./build/"),
        publicPath: "/build/",
        filename: "main.js"
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
            { test: /\.json$/, loader: "json-loader"},
            {
                test: /.*\.(gif|png|jpe?g|svg)$/i,
                loaders: [
                    'file?hash=sha512&digest=hex&name=[hash].[ext]',
                    'image-webpack?{progressive:true, optimizationLevel: 7, interlaced: false, pngquant:{quality: "65-90", speed: 4}}'
                ]
            }
        ]
    },
    plugins: [
        new ExtractTextPlugin("styles.css")
    ]
};
