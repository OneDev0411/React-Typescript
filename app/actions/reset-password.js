// actions/forgot-password.js
import User from '../models/User'
import AppStore from '../stores/AppStore'

export default (password, token) => {
  
  if(password.length < 6 || password !== confirm_password){
    
    let error_type
    if(password.length < 6){
      error_type = 'too-short'
    }

    if(password !== confirm_password){
      error_type = 'no-match'
    }
    
    AppStore.data = {
      submitting: false,
      errors: true,
      show_message: true,
      password_error: error_type
    }

    return AppStore.emitChange()
  
  }
  
  
  User.resetPassword(password, token, (err, response) => {
    
    // Success
    if(response.status == 'success'){
      
      console.log('success')

      AppStore.data = {
        status: 'success',
        show_message: true
      }
    
    } else {
      
      AppStore.data = {
        submitting: false,
        errors: true,
        show_message: true,
        email_not_found: true
      }
    }
    
    AppStore.emitChange()

  })
}