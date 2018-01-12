const path = require("pth")



module.exports = {
  context: src,
  entry: {
   dcalendar: './js/DCalendar.js'
  },
  output: {
    filename: '[name].js',
    path: path.join(__dirname, 'static/js'),
    publicPath: '/static/js/'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use:[
          'eslint-loader'
        ],
        include: src
      },
      {
        test: /\.scss$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: 'css-loader?url=false!postcss-loader!sass-loader'
        }),
        include: src
      }
    ]
  },
  plugins: [
    new 
  ]
}