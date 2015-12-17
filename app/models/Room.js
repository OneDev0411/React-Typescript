// models/Room.js
import es6Promise from 'es6-promise'
es6Promise.polyfill()
import 'isomorphic-fetch'

export default {
  
  create: (params, callback) => {
    
    let api_host = params.api_host
    if(!api_host) api_host = ''

    const create_room_url = api_host + '/api/create-room'

    const request_object = {
      title: params.title,
      owner: params.owner,
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
          status: 'error',
          message: 'There was an error with this request.'
        }
        return callback(error, false)
      }
      return response.json()
    })
    .then((response) => {
      return callback(false, response)
    })
  },

  getMessages: (params, callback) => {
    
    let api_host = params.api_host
    if(!api_host) api_host = ''

    const get_messages_url = api_host + '/api/messages/?room_id=' + params.room_id + '&access_token=' + params.access_token

    fetch(get_messages_url)
    .then((response) => {
      if (response.status >= 400) {
        let error = {
          status: 'error',
          message: 'There was an error with this request.'
        }
        return callback(error, false)
      }
      return response.json()
    })
    .then((response) => {
      return callback(false, response)
    })
  },

  addUser: (params, callback) => {
    
    let api_host = params.api_host
    if(!api_host) api_host = ''

    const add_user_to_room_url = api_host + '/api/add-user-to-room'

    const request_object = {
      room_id: params.room_id,
      users: params.users,
      access_token: params.access_token
    }
    console.log(add_user_to_room_url)
    console.log(request_object)
    fetch(add_user_to_room_url,{
      method: 'post',
      headers: {  
        'Content-type': 'application/json'
      },
      body: JSON.stringify(request_object)
    })
    .then((response) => {
      if (response.status >= 400) {
        let error = {
          status: 'error',
          message: 'There was an error with this request.'
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