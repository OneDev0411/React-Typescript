// actions/forgot-password.js
import User from '../models/User'
import AppStore from '../stores/AppStore'

export default (password, token) => {
  
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