// models/Listing.js
import es6Promise from 'es6-promise'
es6Promise.polyfill()
import 'isomorphic-fetch'

import config from '../../config/public'

const API_HOST = config.api_url

const getRequest = (url, token) => new Request(url, {
  method: 'GET',
  headers: new Headers({
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json'
  })
})

const asyncRequest = async (request) => {
  try {
    const response = await fetch(request)
    if (response.status >= 200 && response.status < 300) {
      const parsedResponse = await response.json()
      return parsedResponse.data
    }
  } catch (error) {
    throw error
  }
}

export default {
  get: (params, callback) => {
    let api_host = params.api_host
    if (!api_host) api_host = config.app.url
    const endpoint = `${api_host}/api/listings/${params.id}?access_token=${params.access_token}`
    fetch(endpoint)
    .then((response) => {
      if (response.status >= 400) {
        const error = {
          status: 'error',
          response
        }
        return callback(error, false)
      }
      return response.json()
    })
    .then(response => callback(false, response))
  },
  getMlsNumber: (params, callback) => {
    const { access_token, q } = params
    const url = `${API_HOST}/listings/search?mls_number=${q}`
    callback(false, asyncRequest(getRequest(url, access_token)))
  },
  search: (params, callback) => {
    const { access_token, q } = params
    const url = `${API_HOST}/listings/search?q=${q}`
    callback(false, asyncRequest(getRequest(url, access_token)))
  },
  getValerts: (params, callback) => {
    let api_host = params.api_host
    if (!api_host) {
      api_host = config.app.url
    }
    const endpoint = `${api_host}/api/listings/valerts?access_token=${params.access_token}`
    const request_object = {
      options: params.options
    }
    if (params.office) {
      request_object.office = params.office
    }
    if (params.offset) {
      request_object.offset = params.offset
    }
    fetch(endpoint, {
      method: 'post',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify(request_object)
    })
    .then((response) => {
      if (response.status >= 400) {
        const error = {
          status: 'error',
          response
        }
        return callback(error, false)
      }
      return response.json()
    })
    .then(response => callback(false, response))
  }
}
