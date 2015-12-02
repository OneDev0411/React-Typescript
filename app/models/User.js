// models/User.js
import es6Promise from 'es6-promise'
es6Promise.polyfill();
import 'isomorphic-fetch'

import config from '../../config/public'

export default {
  
  signin: (email, password, callback) => {
    
    const app_url = config.app.url
    const signin_url = app_url + '/api/signin'

    const request_object = {
      email: email,
      password: password
    }
      
    fetch(signin_url,{
      method: 'post',
      credentials: 'include',
      headers: {  
        'Content-type': 'application/json',
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
  },

  getRooms: (access_token, callback) => {
    
    const app_url = config.app.url
    const get_rooms_url = app_url + '/api/rooms?access_token=' + access_token
    
    fetch(get_rooms_url)
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
  },

  forgotPassword: (email, callback) => {
    
    const app_url = config.app.url
    const forgot_password_url = app_url + '/api/forgot-password'
    const request_object = {
      email: email
    }
    
    fetch(forgot_password_url,{
      method: 'post',
      headers: {  
        'Content-type': 'application/json',
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