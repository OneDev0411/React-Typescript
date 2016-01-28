// models/Transaction.js
import es6Promise from 'es6-promise'
es6Promise.polyfill()
import 'isomorphic-fetch'
import superagent from 'superagent'
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
      roles: params.roles,
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
  get: (params, callback) => {
    let api_host = params.api_host
    if (!api_host) api_host = config.app.url
    const endpoint = api_host + '/api/get-transaction?access_token=' + params.access_token + '&id=' + params.id
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
  edit: (params, callback) => {
    let api_host = params.api_host
    if (!api_host) api_host = config.app.url
    const transaction = params.transaction
    const endpoint = api_host + '/api/edit-transaction?id=' + transaction.id
    const user = params.user
    const request_object = {
      access_token: params.access_token,
      listing_data: params.listing_data,
      transaction_type: transaction.transaction_type,
      user: user.id
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
  },
  addRole: (params, callback) => {
    let api_host = params.api_host
    if (!api_host) api_host = config.app.url
    const transaction = params.transaction
    const endpoint = api_host + '/api/transactions/role?id=' + transaction.id
    const role = params.role
    const request_object = {
      access_token: params.access_token,
      role
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
  },
  deleteRole: (params, callback) => {
    let api_host = params.api_host
    if (!api_host) api_host = config.app.url
    const transaction = params.transaction
    const endpoint = api_host + '/api/transactions/delete-role?id=' + transaction.id
    const role = params.role
    const request_object = {
      access_token: params.access_token,
      role
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
  },
  uploadFiles: (params, callback) => {
    const api_url = config.api_url
    const endpoint = api_url + '/transactions/' + params.id + '/attachments'
    const request = superagent.post(endpoint)
    const files = params.files
    request.set('authorization', 'Bearer ' + params.access_token)
    files.forEach(file => {
      const info = {
        name: file.name,
        original_name: file.name,
        title: file.new_name || file.name
      }
      request.attach('media', file)
      request.field('info', JSON.stringify(info))
    })
    request.end((err, res) => {
      if (err)
        return callback(err, res)
      return callback(err, res)
    })
  }
}