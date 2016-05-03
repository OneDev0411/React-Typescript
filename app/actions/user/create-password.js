// actions/create-password.js
import User from '../../models/User'
import AppStore from '../../stores/AppStore'
export default (email, password, confirm_password, token) => {
  if (password.length < 6 || password !== confirm_password) {
    let error_type
    if (password.length < 6)
      error_type = 'too-short'

    if (password !== confirm_password)
      error_type = 'no-match'

    AppStore.data = {
      submitting: false,
      errors: true,
      show_message: true,
      password_error: error_type
    }
    return AppStore.emitChange()
  }
  const params = {
    email,
    password,
    token
  }
  User.createPassword(params, (err, response) => {
    // Success
    if (response.status === 'success') {
      // Sign in
      const params_signin = {
        email,
        password
      }
      User.signin(params_signin, (err_signin, response_signin) => {
        const user = response_signin.data
        const access_token = response_signin.access_token
        user.access_token = access_token
        AppStore.data.user = user
        delete AppStore.data.submitting
        AppStore.emitChange()
      })
    } else {
      AppStore.data = {
        submitting: false,
        errors: true,
        show_message: true,
        request_error: true
      }
    }
    AppStore.emitChange()
  })
}