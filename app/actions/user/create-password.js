// actions/create-password.js
import User from '../../models/User'
import AppStore from '../../stores/AppStore'
import async from 'async'
export default (email, password, first_name, last_name, token) => {
  if (password.length < 6) {
    let error_type
    if (password.length < 6)
      error_type = 'too-short'
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
  const locals = {}
  async.series([
    callback => {
      // Create pass
      User.createPassword(params, (err, response) => {
        // Success
        if (response.status === 'success')
          callback()
        else {
          AppStore.data = {
            submitting: false,
            errors: true,
            show_message: true,
            request_error: true
          }
          AppStore.emitChange()
        }
      })
    },
    callback => {
      // Sign in
      const params_signin = {
        email,
        password
      }
      User.signin(params_signin, (err_signin, response_signin) => {
        const user = response_signin.data
        const access_token = response_signin.access_token
        user.access_token = access_token
        locals.user = user
        callback()
      })
    },
    () => {
      // Edit first / last name
      const local_user = locals.user
      const user_info = {
        first_name,
        last_name
      }
      const params_edit = {
        access_token: local_user.access_token,
        user: user_info
      }
      User.edit(params_edit, (err, response) => {
        const user = response.data
        AppStore.data.user = user
        AppStore.emitChange()
      })
    }
  ])
}