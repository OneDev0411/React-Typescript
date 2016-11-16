// modesl/website
import ES6 from 'es6-promise'
ES6.polyfill()
import 'isomorphic-fetch'
import config from '../config'
import superagent from 'superagent'
export default {
  get(params, callback) {
    const endpoint = `${config.api_url}/websites`
    fetch(endpoint, {
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
        'authorization': 'Bearer ' + params.access_token
      }
    })
    .then(response => {
      if (response.status >= 400) {
        return callback(response, null)
      }
      return response.json()
    })
    .then(response => {
      return callback(null, response)
    })
  },
  create(params, callback) {
    const endpoint = `${config.api_url}/websites`
    fetch(endpoint, {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        'authorization': 'Bearer ' + params.access_token
      },
      body: JSON.stringify(params.website)
    })
    .then(response => {
      if (response.status >= 400) {
        return callback(response, null)
      }
      return response.json()
    })
    .then(response => {
      return callback(null, response)
    })
  },
  edit(params, callback) {
    const endpoint = `${config.api_url}/websites/${params.website.id}`
    fetch(endpoint, {
      method: 'put',
      headers: {
        'Content-Type': 'application/json',
        'authorization': 'Bearer ' + params.access_token
      },
      body: JSON.stringify(params.website)
    })
    .then(response => {
      if (response.status >= 400) {
        return callback(response, null)
      }
      return response.json()
    })
    .then(response => {
      return callback(null, response)
    })
  },
  uploadFiles: (params, callback) => {
    const endpoint = `${config.api_url}/attachments`
    const request = superagent.post(endpoint)
    const file = params.file
    request.set('authorization', 'Bearer ' + params.access_token)
    request.attach('media', file)
    request.end((err, res) => {
      return callback(err, res.body)
    })
  },
  createHostname: (params, callback) => {
    const endpoint = `${config.api_url}/websites/${params.id}/hostnames`
    const body = {
      hostname: params.hostname,
      is_default: params.is_default
    }
    fetch(endpoint, {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        'authorization': 'Bearer ' + params.access_token
      },
      body: JSON.stringify(body)
    })
    .then(response => {
      if (response.status >= 400) {
        return callback(response, null)
      }
      return response.json()
    })
    .then(response => {
      return callback(null, response)
    })
  }
}