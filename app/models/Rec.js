// models/Rec.js
import es6Promise from 'es6-promise'
es6Promise.polyfill()
import 'isomorphic-fetch'
import config from '../../config/public'

export default {
  getActives: (params, callback) => {
    let api_host = params.api_host
    if (!api_host) api_host = config.app.url
    const endpoint = `${api_host}/api/recs/get-actives?access_token=${params.access_token}`
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
  getFavorites: (params, callback) => {
    let api_host = params.api_host
    if (!api_host) api_host = config.app.url
    const room_id = params.room_id
    const endpoint = `${api_host}/api/recs/get-favorites?room_id=${room_id}&access_token=${params.access_token}`
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
  getFeed: (params, callback) => {
    let api_host = params.api_host
    if (!api_host) api_host = config.app.url
    const room_id = params.room_id
    const endpoint = `${api_host}/api/recs/get-feed?room_id=${room_id}&access_token=${params.access_token}`
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
  mark: (params, callback) => {
    let api_host = params.api_host
    if (!api_host) api_host = config.app.url
    const alert_id = params.alert_id
    const access_token = params.access_token
    const room_id = params.room_id
    const request_object = {
      alert_id,
      room_id
    }
    const endpoint = `${api_host}/api/recs/mark?access_token=${params.access_token}`
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