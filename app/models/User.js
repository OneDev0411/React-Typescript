// models/User.js
import es6Promise from 'es6-promise'
es6Promise.polyfill();
import 'isomorphic-fetch'

export default {
  
  signin: (email, password, callback) => {
    
    const signin_url = '/api/signin'

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
    
    const get_rooms_url = '/api/rooms?access_token=' + access_token
    
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
    
    const forgot_password_url = '/api/forgot-password'
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
  },

  resetPassword: (password, token, callback) => {
    
    const reset_password_url = '/api/reset-password'

    const request_object = {
      token: token,
      password: password
    }
    
    fetch(reset_password_url,{
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
  },

  verifyPhone: (code, token, callback) => {
    
    const verify_phone_url = '/api/verify-phone'

    const request_object = {
      code: code,
      token: token
    }
    
    fetch(verify_phone_url,{
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