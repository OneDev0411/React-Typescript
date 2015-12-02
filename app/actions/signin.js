// actions/signin.js
import User from '../models/User'
import AppStore from '../stores/AppStore'

export default (email, password, redirect_to) => {
  
  User.signin(email, password, (err, response) => {
    
    // Success
    if(response.status == 'success'){
      
      let user = response.data
      user.access_token = response.access_token

      AppStore.data = {
        user: user,
      }
    
    } else {
      
      AppStore.data = {
        submitting: false,
        errors: true,
        show_message: true,
        validation: {
          email_valid: false,
          password_valid: false
        }
      }
    }
    
    AppStore.emitChange()

  })
}