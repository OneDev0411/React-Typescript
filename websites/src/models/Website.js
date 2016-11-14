// modesl/website
import ES6 from 'es6-promise'
ES6.polyfill()
import 'isomorphic-fetch'
import config from '../config'
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
  save(params, callback) {
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
  }
}