// actions/signup.js
import User from '../models/User'
import AppStore from '../stores/AppStore'
import validator from 'validator'

export default (user, password, confirm_password, redirect_to) => {
  
  let email = user.email
  if(email && password && confirm_password){
    email = user.email.trim()
    password = password.trim()
    confirm_password = confirm_password.trim()
  }

  /* Handle errors
  ==================== */
  let error_type
  let password_error

  // Password
  if(!validator.isEmail(email) || password.length < 6 || password !== confirm_password){
    
    if(!validator.isEmail(email)){
      error_type = 'email'
    }

    if(error_type !== 'email'){
      if(password.length < 6){
        error_type = 'password'
        password_error = 'too-short'
      }

      if(password !== confirm_password){
        error_type = 'password'
        password_error = 'no-match'
      }
    }
    
    AppStore.data = {
      submitting: false,
      errors: true,
      show_message: true,
      error_type: error_type,
      password_error: password_error
    }

    return AppStore.emitChange()
  
  }

  // Set trimmed data
  user.email = email
  user.password = password

  const params = {
    user: user
  }

  User.create(params, (err, response) => {
    
    // Success
    if(response.status == 'success'){
      
      AppStore.data = {
        status: 'success',
        show_message: true
      }
    
    } else {
      
      AppStore.data = {
        submitting: false,
        errors: true,
        error_type: 'server',
        show_message: true,
        response: 'email-in-use'
      }
    }
    
    AppStore.emitChange()

  })
}