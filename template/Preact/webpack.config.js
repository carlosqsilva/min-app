const autoprefixer = require("autoprefixer")
const HtmlWebpackPlugin = require("html-webpack-plugin")
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const path = require("path")

const styleLoader = {
  loader: "style-loader"
}

const cssLoader = {
  loader: "css-loader",
  options: {
    importLoaders: 1,
    modules: false,
    minimize: true,
    sourceMap: false
  }
}

const postCssLoader = {
  loader: "postcss-loader",
  options: {
    ident: "postcss",
    sourceMap: false,
    plugins: [
      autoprefixer({
        browsers: ["Chrome >= 60", "Firefox >= 55"],
        flexbox: false
      })
    ]
  }
}

module.exports = (env, argv) => {
  const inProd = argv.mode === "production"
  console.log(inProd)

  return {
    entry: "./src/index.js",
    output: {
      path: path.resolve("dist"),
      filename: "[name].[hash:4].js"
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: path.resolve("src/index.html"),
        inject: true
      }),
      new MiniCssExtractPlugin({
        filename: inProd ? "static/[name].[hash:4].css" : "[id].css"
      })
    ],
    optimization: {
      splitChunks: {
        cacheGroups: {
          styles: {
            name: "styles",
            test: /\.css$/,
            chunks: "all"
          }
        }
      }
    },
    module: {
      rules: [
        {
          enforce: "pre",
          test: /\.js$/,
          exclude: /node_modules/,
          loader: "eslint-loader"
        },
        {
          oneOf: [
            {
              test: /\.(png|jpg|jpeg|gif|svg)$/,
              loader: "url-loader",
              options: {
                limit: 10000,
                name: "static/[name].[hash:4].[ext]"
              }
            },
            {
              test: /\.js$/,
              exclude: /node_modules/,
              use: {
                loader: "babel-loader"
              }
            },
            {
              test: /\.css$/,
              use: [
                inProd ? MiniCssExtractPlugin.loader : styleLoader,
                cssLoader,
                postCssLoader
              ]
            },
            {
              loader: "file-loader",
              exclude: /\.(js|html|json)$/,
              options: {
                name: "static/[name].[hash:4].[ext]"
              }
            }
          ]
        }
      ]
    }
  }
}
