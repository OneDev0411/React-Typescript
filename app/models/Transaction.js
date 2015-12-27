// models/Transaction.js
import es6Promise from 'es6-promise'
es6Promise.polyfill()
import 'isomorphic-fetch'

import config from '../../config/public'

export default {
  create: (params, callback) => {
    let api_host = params.api_host
    if (!api_host) api_host = config.app.url

    // TBD
    // const create_room_url = api_host + '/api/create-room'

    // const request_object = {
    //   title: params.title,
    //   owner: params.owner,
    //   access_token: params.access_token
    // }
    // fetch(create_room_url, {
    //   method: 'post',
    //   headers: {
    //     'Content-type': 'application/json'
    //   },
    //   body: JSON.stringify(request_object)
    // })
    // .then((response) => {
    //   if (response.status >= 400) {
    //     const error = {
    //       status: 'error',
    //       message: 'There was an error with this request.'
    //     }
    //     return callback(error, false)
    //   }
    //   return response.json()
    // })
    // .then((response) => {
    //   return callback(false, response)
    // })
  },
  getTransactions: (params, callback) => {
    
    // TBD
    // let api_host = params.api_host
    // if (!api_host) api_host = config.app.url

    // const get_messages_url = `${api_host}/api/messages/?room_id=${params.room_id}` +
    //   `&access_token=${params.access_token}` +
    //   `&limit=${params.limit}` +
    //   `&max_value=${params.max_value}`

    // fetch(get_messages_url)
    // .then((response) => {
    //   if (response.status >= 400) {
    //     const error = {
    //       status: 'error',
    //       message: 'There was an error with this request.'
    //     }
    //     return callback(error, false)
    //   }
    //   return response.json()
    // })
    // .then((response) => {
    //   return callback(false, response)
    // })
  }
}