const path = require("path");
const { CleanWebpackPlugin } = require("clean-webpack-plugin"); // For cleaning up the /dist folder
const HtmlWebPackPlugin = require("html-webpack-plugin"); // For updating HTML page of all webpack bundles in the body's script tag

// Project paths
const PATH_SOURCE = path.join(__dirname, "./src"); // Source code path
const PATH_DIST = path.join(__dirname, "./dist"); // Build distribution path

// Environment
const env = process.env.NODE_ENV;

module.exports = {
  // The point or points to enter the application. This is where Webpack will start.
  // One entry point per HTML page. For single-page applications, this means one entry point.
  // For traditional multi-page apps, we may have multiple entry points.
  // https://webpack.js.org/concepts/entry-points/
  entry: {
    //vendorA: "./vendor/ven.css",
    //vendorB: path.join(PATH_SOURCE, "./vendor-js.js"),
    app: path.join(PATH_SOURCE, "./index.js")
  },

  // Determine how the different types of modules will function.
  // https://webpack.js.org/configuration/module/
  // https://webpack.js.org/concepts/loaders/
  module: {
    rules: [
      // Babel loader
      {
        test: /\.(js|jsx)$/, // Apply this rule to files ending in .js or .jsx
        exclude: /(node_modules)/, // Don't apply to files residing in node_modules
        use: {
          loader: "babel-loader",
          // Pass options to both babel-loader and Babel. This option object replaces babel.config.js.
          options: {
            presets: [
              [
                "@babel/preset-env",
                {
                  // Configure how @babel/preset-env handles transform. Specify target environments using queries in "browserslist" in package.json.
                  // https://babeljs.io/docs/en/babel-preset-env
                  // https://github.com/browserslist/browserslist
                  // https://browserl.ist/
                  useBuiltIns: "usage", // Adds specific imports for polyfills when they are used in each file
                  corejs: { version: 3.4, proposals: true }, // Specify the core-js version. Must match the version in package.json
                  debug: false // Output the targets/plugins, used when compiling
                }
              ],
              ["@babel/preset-react"]
            ]
          }
        }
      },
      // Image loader
      {
        test: /\.(png|svg|jpg|gif)$/,
        loader: "file-loader",
        options: {
          // default name uses '[contenthash].[ext]'
          outputPath: "images"
        }
      },
      // Font loader
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        loader: "file-loader",
        options: {
          // default name uses '[contenthash].[ext]'
          outputPath: "fonts"
        }
      },
      // HTML loader
      {
        test: /\.html$/,
        use: [
          {
            loader: "html-loader"
          }
        ]
      }
    ]
  },

  plugins: [
    new CleanWebpackPlugin({
      // specify sub-directories to clean
      cleanOnceBeforeBuildPatterns: ["dist/js", "dist/css", "dist/images"]
    }),
    new HtmlWebPackPlugin({
      template: path.join(PATH_SOURCE, "./index.html"),
      filename: "./index.html"
    })
  ],

  // Tell Webpack where to emit the bundles it creates and how to name them.
  // https://webpack.js.org/concepts/output/
  // https://webpack.js.org/configuration/output/#outputfilename
  output: {
    path: PATH_DIST,
    filename: env == "production" ? "js/[name].[hash].js" : "js/[name].js",
    chunkFilename:
      env == "production" ? "js/[name].[contenthash].js" : "js/[name].js" // use contenthash for caching
  }
};

/*
Notes
Require the following dependencies in production to support feature in IE 11:
    core-js - to use Promise (ES2015/ES6) https://github.com/zloirock/core-js
    regenerator - to use Async/Await (ES2017/ES8) https://github.com/facebook/regenerator
*/
