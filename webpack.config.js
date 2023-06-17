const path = require("path");
const glob = require("glob");
const { IgnorePlugin } = require("webpack");

module.exports = {
  entry: glob.sync("./src/functions/**/*.ts").reduce((entries, entry) => {
    const name = entry
      .replace(/^\.\/src\/functions\//, "")
      .replace(/\.ts$/, "");
    entries[name] = entry;
    return entries;
  }, {}),
  target: "node",
  mode: "production",
  resolve: {
    extensions: [".ts", ".js"],
  },
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "dist"),
    libraryTarget: "commonjs2",
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: "ts-loader",
      },
    ],
  },
  optimization: {
    minimize: false,
  },
  plugins: [
    new IgnorePlugin({
      resourceRegExp: /^pg-native$|^cloudflare:sockets$/,
    }),
  ],
};
