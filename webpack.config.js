const ExtractTextPlugin = require('extract-text-webpack-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const CleanPlugin = require("clean-webpack-plugin")
const path = require("path");
const src = path.join(__dirname, 'src')
module.exports = {
  context: src,
  entry: {
   dcalendar: './js/app.js'
  },
  output: {
    filename: '[name].js',
    path: path.join(__dirname, 'static/js'),
    publicPath: '/static/js/'
  },
  module: {
    rules: [
      // {
      //   test: /\.js$/,
      //   use:[
      //     'eslint-loader'
      //   ],
      //   include: src
      // },
      {
        test: /\.scss$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            {
              loader: 'css-loader',
              options:{
                minimize:true,
                url: false
              }
            },
            {
              loader: 'postcss-loader',
              options: {}
            },
            {
              loader: 'sass-loader',
              options: {}
            }
          ]
        }),
        include: src
      }
    ]
  },
  plugins: [
    new CleanPlugin('static'),
    new ExtractTextPlugin('../css/DCalendar.css'),
    new UglifyJsPlugin()
  ]
}
