// models/Listing.js
import es6Promise from 'es6-promise'
es6Promise.polyfill()
import 'isomorphic-fetch'

import config from '../../config/public'

export default {
  get: (params, callback) => {
    let api_host = params.api_host
    if (!api_host) api_host = config.app.url
    const endpoint = api_host + '/api/listings/' + params.id + '?access_token=' + params.access_token
    fetch(endpoint)
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
  search: (params, callback) => {
    let api_host = params.api_host
    if (!api_host) api_host = config.app.url
    const endpoint = api_host + '/api/listings/search?q=' + params.q + '&access_token=' + params.access_token
    fetch(endpoint)
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
  getSimilars: (params, callback) => {
    let api_host = params.api_host
    if (!api_host) api_host = config.app.url
    const endpoint = api_host + '/api/listings/similars?mls_number=' + params.mls_number + '&access_token=' + params.access_token
    fetch(endpoint)
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
  getValerts: (params, callback) => {
    let api_host = params.api_host
    if (!api_host) api_host = config.app.url
    const endpoint = api_host + '/api/listings/valerts'
    const request_object = {
      options: params.options,
      access_token: params.access_token
    }
    if (params.office)
      request_object.office = params.office
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