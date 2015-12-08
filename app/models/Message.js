// models/Message.js
import es6Promise from 'es6-promise'
es6Promise.polyfill()
import 'isomorphic-fetch'
let config
if(!process.env.NODE_ENV || process.env.NODE_ENV === 'development')
  config = require('../../config/development')

export default {
  
  create: (params, callback) => {
    
    let api_host = params.api_host
    if(config && config.api_host)
      api_host = config.api_host
    if(!api_host) api_host = ''

    const create_room_url = api_host + '/api/create-message'

    const request_object = {
      room_id: params.room_id,
      comment: params.comment,
      message_type: params.message_type,
      author: params.author,
      access_token: params.access_token
    }
      
    fetch(create_room_url,{
      method: 'post',
      headers: {  
        'Content-type': 'application/json'
      },
      body: JSON.stringify(request_object)
    })
    .then((response) => {
      if (response.status >= 400) {
        let error = {
          "status": "error",
          "message": "There was an error with this request."
        }
        return callback(error, false)
      }
      return response.json()
    })
    .then((response) => {
      return callback(false, response)
    })
  }
}