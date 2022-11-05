const path = require("path");
const { IgnorePlugin } = require("webpack");

module.exports = {
  entry: {
    main: path.resolve("./client/src/index.ts"),
  },
  devtool: "inline-source-map",
  output: {
    path: path.resolve("./dist/frontend/"),
    filename: "[name].js",
    sourceMapFilename: "[name].js.map",
  },
  resolve: {
    extensions: [".ts", ".js"],
    fallback: {
      // stream: require.resolve("stream-browserify"),
      // url: require.resolve("url/"),
      // crypto: require.resolve("crypto-browserify"),
      // buffer: require.resolve("buffer/"),
      // zlib: require.resolve("browserify-zlib"),
      // http: require.resolve("stream-http"),
      // https: require.resolve("https-browserify"),
      // assert: require.resolve("assert/"),
      // util: require.resolve("util/"),
      // net: require.resolve("net-browserify"),
      // os: require.resolve("os-browserify/browser"),
      // path: require.resolve("path-browserify"),
      // tls: require.resolve("tls-browserify"),
      // "utf-8-validate": require.resolve("utf-8-validate"),
      // bufferutil: require.resolve("bufferutil"),
      // fs: false,
    },
  },
  plugins: [
    new IgnorePlugin({
      resourceRegExp: /async_hooks/,
    }),
  ],
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: [
          {
            loader: "ts-loader",
          },
        ],
      },
    ],
  },
  mode: "development",
};
