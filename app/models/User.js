// models/User.js
import es6Promise from 'es6-promise'
es6Promise.polyfill()
import 'isomorphic-fetch'
if(!process.env.NODE_ENV || process.env.NODE_ENV === 'development')
  var config = require('../../config/development')

export default {
  
  create: (params, callback) => {
    
    let api_host = params.api_host
    if(config.api_host)
      api_host = config.api_host
    if(!api_host) api_host = ''

    const create_url = api_host + '/api/signup'

    const request_object = params.user
      
    fetch(create_url,{
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

  signin: (params, callback) => {
    
    let api_host = params.api_host
    if(config.api_host)
      api_host = config.api_host
    if(!api_host) api_host = ''

    const signin_url = api_host + '/api/signin'

    const request_object = {
      email: params.email,
      password: params.password
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

  forgotPassword: (params, callback) => {
    
    let api_host = params.api_host
    if(config.api_host)
      api_host = config.api_host
    if(!api_host) api_host = ''

    const forgot_password_url = api_host + '/api/forgot-password'
    const request_object = {
      email: params.email
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

  resetPassword: (params, callback) => {
    
    let api_host = params.api_host
    if(config.api_host)
      api_host = config.api_host
    if(!api_host) api_host = ''

    const reset_password_url = api_host + '/api/reset-password'
    const request_object = {
      token: encodeURIComponent(params.token),
      password: params.password
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

  verifyPhone: (params, callback) => {
    
    let api_host = params.api_host
    if(config.api_host)
      api_host = config.api_host
    if(!api_host) api_host = ''

    const verify_phone_url = api_host + '/api/verify-phone'

    const request_object = {
      code: params.code,
      token: encodeURIComponent(params.token)
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
  },

  getRooms: (params, callback) => {
    
    let api_host = params.api_host
    if(config.api_host)
      api_host = config.api_host
    if(!api_host) api_host = ''

    const get_rooms_url = api_host + '/api/rooms?access_token=' + params.access_token
    
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
  }

}