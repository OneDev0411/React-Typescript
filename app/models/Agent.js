// models/Agent.js
import es6Promise from 'es6-promise'
es6Promise.polyfill()
import 'isomorphic-fetch'
import config from '../../config/public'
export default {
  getReport: (params, callback) => {
    const endpoint = '/api/agents/get-report'
    const request_object = {
      access_token: params.access_token,
      criteria: params.criteria
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
      .then(response => callback(false, response))
  },
  search: (params, callback) => {
    const endpoint = `/api/agents/search?mlsid=${params.mlsid}`
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
      .then(response => callback(false, response))
  }
}
