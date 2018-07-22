const path = require('path');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const libs = [
    'angular/angular.min.js',
    'hammerjs/hammer.min.js'
];

module.exports = {
    entry: {
        app: "./src/app.js",
    },
    output: {
        path: __dirname + "/public/js/",
        filename: "[name].bundle.js"
    },
    plugins: [
      new CopyWebpackPlugin(
        libs.map(asset => {
          return {
            from: path.resolve(__dirname, `./node_modules/${asset}`),
            to: path.resolve(__dirname, './public/js')
          };
        })
      )
    ]
};