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
