const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const pages = ["compendiumPage", "personaPage"];

module.exports = {
    entry: pages.reduce(
        (value, page) =>
            Object.assign(value, {
                [page]: path.resolve(__dirname, `src/scripts/${page}.js`),
            }),
        {},
    ),
    mode: "development",
    output: {
        filename: "[name].[contenthash].js", // новое название с хешом при изменении файла
        path: path.resolve(__dirname, "dist"),
        clean: true,
        assetModuleFilename: "[name][ext]",
    },
    optimization: {
        splitChunks: {
            chunks: "all",
        },
    },
    devtool: "source-map",
    devServer: {
        static: {
            directory: path.join(__dirname, "dist"),
        },
        port: 3000,
        open: ["/compendiumPage", "personaPage"],
        hot: true,
        compress: true,
        historyApiFallback: true,
    },
    module: {
        rules: [
            {
                test: /\.scss$/,
                use: ["style-loader", "css-loader", "sass-loader"],
            },
            {
                test: /\.(png|svg|jpg|jpeg|gif|ico)$/i,
                type: "asset/resource",
            },
        ],
    },
    plugins: pages.map(
        (page) =>
            new HtmlWebpackPlugin({
                title: `Persona 5 Fusion Calculator`,
                filename: `${page}.html`,
                favicon: "src/assets/images/favicon.ico",
                template: `src/${page}.html`,
                chunks: [page],
            }),
    ),
};
