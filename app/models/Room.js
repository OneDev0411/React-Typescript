// models/Room.js
import es6Promise from 'es6-promise'
es6Promise.polyfill();
import 'isomorphic-fetch'

export default {
  
  create: (title, owner, access_token, callback) => {
    
    const create_room_url = '/api/create-room'

    const request_object = {
      title: title,
      owner: owner,
      access_token: access_token
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