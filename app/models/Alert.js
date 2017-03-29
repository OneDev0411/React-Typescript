// models/Alert.js
import es6Promise from 'es6-promise'
es6Promise.polyfill()
import 'isomorphic-fetch'
import config from '../../config/public'

export default {
  get: (params, callback) => {
    let api_host = params.api_host
    if (!api_host) api_host = config.app.url
    const endpoint = `${api_host}/api/alerts/get-alert-room?room_id=${params.room_id}&alert_id=${params.alert_id}&access_token=${params.access_token}`
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
  getPaged: (params, callback) => {
    let api_host = params.api_host
    if (!api_host) api_host = config.app.url
    const endpoint = `${api_host}/api/alerts/get-alert-room?room_id=${params.room_id}&alert_id=${params.alert_id}&access_token=${params.access_token}&timestamp=${params.timestamp}`
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
  getAll: (params, callback) => {
    let api_host = params.api_host
    if (!api_host) api_host = config.app.url
    const endpoint = `${api_host}/api/alerts/get-alerts?access_token=${params.access_token}`
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
  acknowledgeNotifications: (params, callback) => {
    let api_host = params.api_host
    if (!api_host) api_host = config.app.url
    const alert = params.alert
    const endpoint = `${api_host}/api/acknowledge-alert-notifications?access_token=${params.access_token}`
    const request_object = {
      alert
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