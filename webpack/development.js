import webpack from 'webpack'
import webpackConfig from './base'
import appConfig from '../config/webpack'
import WebpackNotifierPlugin from 'webpack-notifier'
import Jarvis from 'webpack-jarvis'

const postcss = function postcss() {
  return [
    require('postcss-cssnext')({}),
    require('postcss-browser-reporter')({}),
    require('postcss-reporter')({})
  ]
}

webpackConfig.entry = [
  'babel-polyfill',
  'react-hot-loader/patch',
  'webpack-hot-middleware/client',
  appConfig.compile.entry
]

webpackConfig.plugins.push(
  new webpack.HotModuleReplacementPlugin(),
  new Jarvis({
    port: 1337 // optional: set a port
  }),
  // new webpack.NoEmitOnErrorsPlugin(),
  new WebpackNotifierPlugin({ alwaysNotify: true })
)

webpackConfig.module.rules.push(
  {
    test: /\.css/,
    use: [
      'style-loader',
      'css-loader',
      {
        loader: 'postcss-loader',
        options: {
          plugins: postcss
        }
      }
    ]
  },
  {
    test: /\.scss/,
    use: [
      'style-loader',
      'css-loader',
      {
        loader: 'postcss-loader',
        options: {
          plugins: postcss
        }
      },
      'sass-loader'
    ]
  }
)

export default webpackConfig


let test = {
  'req': {
    'method': 'POST',
    'url': '/api/proxifier/upload/contacts-outlook.csv',
    'headers': {
      'x-method': 'post',
      'x-endpoint': '/contacts/outlook.csv',
      'authorization': 'Bearer MDdmZDljOGEtMDQwOS0xMWU4LTg2MWEtMGFlNzg1NjM4ZWI0'
    }
  },
  'xhr': {
    'headers': {
      'X-Method': 'post',
      'X-Endpoint': '/contacts/outlook.csv',
      'Authorization': 'Bearer MDdmZDljOGEtMDQwOS0xMWU4LTg2MWEtMGFlNzg1NjM4ZWI0'
    }
  },
  'text': '.......',
  'statusText': 'OK',
  'statusCode': 200,
  'status': 200,
  'statusType': 2,
  'info': false,
  'ok': true,
  'redirect': false,
  'clientError': false,
  'serverError': false,
  'error': false,
  'accepted': false,
  'noContent': false,
  'badRequest': false,
  'unauthorized': false,
  'notAcceptable': false,
  'forbidden': false,
  'notFound': false,
  'headers': {
    'date': 'Sun, 28 Jan 2018 09:05:14 GMT',
    'connection': 'keep-alive',
    'content-length': '10189',
    'content-type': 'text/html; charset=utf-8'
  },
  'header': {
    'date': 'Sun, 28 Jan 2018 09:05:14 GMT',
    'connection': 'keep-alive',
    'content-length': '10189',
    'content-type': 'text/html; charset=utf-8'
  },
  'type': 'text/html',
  'charset': 'utf-8',
  'links': {},
  'body': null
}
