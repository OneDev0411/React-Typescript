// models/Transaction.js
import es6Promise from 'es6-promise'
es6Promise.polyfill()
import 'isomorphic-fetch'
import config from '../../config/public'
export default {
  create: (params, callback) => {
    let api_host = params.api_host
    if (!api_host) api_host = config.app.url
    const endpoint = api_host + '/api/create-transaction'
    const request_object = {
      transaction_type: params.transaction_type,
      title: params.title,
      contract_price: params.contract_price,
      contacts: params.contacts,
      dates: params.dates,
      access_token: params.access_token
    }
    // Add listing if available
    const listing = params.listing
    if (listing)
      request_object.listing = listing.id
    const listing_data = params.listing_data
    request_object.listing_data = listing_data
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
          message: 'There was an error with this request.'
        }
        return callback(error, false)
      }
      return response.json()
    })
    .then(response => {
      return callback(false, response)
    })
  },
  getAll: (params, callback) => {
    let api_host = params.api_host
    if (!api_host) api_host = config.app.url
    const endpoint = api_host + '/api/transactions?access_token=' + params.access_token
    fetch(endpoint)
    .then(response => {
      if (response.status >= 400) {
        const error = {
          status: 'error',
          message: 'There was an error with this request.'
        }
        return callback(error, false)
      }
      return response.json()
    })
    .then(response => {
      return callback(false, response)
    })
  },
  delete: (params, callback) => {
    let api_host = params.api_host
    if (!api_host) api_host = config.app.url
    const endpoint = api_host + '/api/delete-transaction?id=' + params.id
    const request_object = {
      access_token: params.access_token
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
          message: 'There was an error with this request.'
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