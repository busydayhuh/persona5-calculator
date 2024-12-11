const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
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
        usedExports: false,
        sideEffects: true,
    },
    //devtool: "source-map",
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
                use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"],
            },
            {
                test: /\.(png|svg|jpg|jpeg|gif|ico|woff|woff2|eot|ttf|webp)$/i,
                type: "asset/resource",
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: ["@babel/preset-env"],
                    },
                },
            },
        ],
    },

    plugins: [
        new HtmlWebpackPlugin({
            title: `Persona 5 Fusion Calculator`,
            filename: `index.html`,
            favicon: "src/assets/images/favicon.ico",
            template: `src/compendiumPage.html`,
            chunks: ["compendiumPage"],
        }),
        new HtmlWebpackPlugin({
            title: `Persona 5 Fusion Calculator`,
            filename: `personaPage.html`,
            favicon: "src/assets/images/favicon.ico",
            template: `src/personaPage.html`,
            chunks: ["personaPage"],
        }),
        new MiniCssExtractPlugin(),
        //new BundleAnalyzerPlugin({ analyzerPort: 3000 }),
    ],
};
