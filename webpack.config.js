const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const BundleAnalyzerPlugin =
    require("webpack-bundle-analyzer").BundleAnalyzerPlugin;

const pages = ["compendiumPage", "personaPage"];

module.exports = {
    entry: pages.reduce(
        (value, page) =>
            Object.assign(value, {
                [page]: path.resolve(__dirname, `src/scripts/${page}.js`),
            }),
        {},
    ),
    mode: "production",
    output: {
        filename: "[name].[contenthash].js", // новое название с хешом при изменении файла
        path: path.resolve(__dirname, "dist"),
        clean: true,
        assetModuleFilename: "assets/[name][ext]",
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
        watchFiles: ["src/*.html"],
        port: 3000,
        open: ["/compendiumPage.html"],
        hot: true,
        compress: true,
        historyApiFallback: true,
    },
    module: {
        rules: [
            {
                test: /\.(c|sa|sc)ss$/i,
                use: ["style-loader", "css-loader", "sass-loader"],
            },
            {
                test: /\.(png|svg|jpg|jpeg|gif|ico|woff|woff2|eot|ttf|webp)$/i,
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

    // performance: { hints: false },
};
