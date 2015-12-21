// actions/signup.js
import User from '../../models/User'
import AppStore from '../../stores/AppStore'
import validator from 'validator'

export default (user, password, confirm_password, redirect_to) => {
  
  let email = user.email
  if(email && password && confirm_password){
    email = user.email.trim()
    password = password.trim()
    confirm_password = confirm_password.trim()
  }
  let first_name = user.first_name.trim()
  let last_name = user.last_name.trim()

  /* Handle errors
  ==================== */
  let error_type
  let password_error

  // Validattion
  if(!validator.isEmail(email) || 
    password.length < 6 ||
    password !== confirm_password ||
    !first_name || !last_name
  ){
    
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

    if(!first_name){
      error_type = 'first_name'
    }

    if(!last_name){
      error_type = 'last_name'
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