// actions/signin.js
import User from '../../models/User'
import AppStore from '../../stores/AppStore'

export default (email, password, redirect_to, invite) => {
  let email_trim
  let password_trim

  if (email && password) {
    email_trim = email.trim()
    password_trim = password.trim()
  }

  // Handle errors
  if (!email_trim || !password_trim) {
    let email_valid
    let password_valid

    if (!email_trim)
      email_valid = false

    if (!password_trim)
      password_valid = false

    AppStore.data = {
      submitting: false,
      errors: true,
      validation: {
        email_valid,
        password_valid
      }
    }
    return AppStore.emitChange()
  }

  // Process
  const params = {
    email: email_trim,
    password: password_trim,
    redirect_to,
    invite
  }
  console.log('actions',params)
  User.signin(params, (err, response) => {

    // Success
    if (response.status === 'success') {
      const user = response.data
      user.access_token = response.access_token

      AppStore.data = {
        user
      }
    } else
      AppStore.data = {
        submitting: false,
        errors: true,
        show_message: true,
        validation: {
          email_valid: false,
          password_valid: false
        }
      }
    AppStore.emitChange()
  })
}