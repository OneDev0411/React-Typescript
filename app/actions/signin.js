// actions/signin.js
import User from '../models/User'
import AppStore from '../stores/AppStore'

export default (email, password, redirect_to, invite) => {
  
  if(email && password){
    email = email.trim()
    password = password.trim()
  }

  // Handle errors
  if(!email || !password){
    
    let email_valid
    let password_valid

    if(!email){
      email_valid = false
    }
    if(!password){
      password_valid = false
    }
    
    AppStore.data = {
      submitting: false,
      errors: true,
      validation: {
        email_valid: email_valid,
        password_valid: password_valid
      }
    }

    return AppStore.emitChange()
  }
  
  // Process
  const params = {
    email: email,
    password: password,
    redirect_to: redirect_to,
    invite: invite
  }

  User.signin(params, (err, response) => {
    
    // Success
    if(response.status == 'success'){
      
      let user = response.data
      user.access_token = response.access_token

      AppStore.data = {
        user: user
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