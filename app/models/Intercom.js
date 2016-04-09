// models/Intercom.js
import es6Promise from 'es6-promise'
es6Promise.polyfill()
import 'isomorphic-fetch'
import config from '../../config/public'

export default {
  signup: (params, callback) => {
    let api_host = params.api_host
    if (!api_host) api_host = config.app.url
    const endpoint = api_host + '/api/intercom/signup'
    const request_object = {
      user: params.user
    }
    fetch(endpoint, {
      method: 'post',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify(request_object)
    })
    .then(response => {
      if (response.status >= 400) {
        const error = {
          status: 'error',
          response
        }
        return callback(error, false)
      }
      return response.json()
    })
    .then(response => {
      return callback(false, response)
    })
  },
  signin: (params, callback) => {
    let api_host = params.api_host
    if (!api_host) api_host = config.app.url
    const endpoint = api_host + '/api/intercom/signin'
    const request_object = {
      user: params.user
    }
    fetch(endpoint, {
      method: 'post',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify(request_object)
    })
    .then(response => {
      if (response.status >= 400) {
        const error = {
          status: 'error',
          response
        }
        return callback(error, false)
      }
      return response.json()
    })
    .then(response => {
      return callback(false, response)
    })
  }
}