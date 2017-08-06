// actions/create-password.js
import User from '../../models/User'
import AppStore from '../../stores/AppStore'
import async from 'async'
export default (email, password, first_name, last_name, token, agent, new_email, phone_number) => {
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
    token,
    agent
  }
  if (phone_number) {
    delete params.email
    params.phone_number = phone_number
    params.new_email = true
  }
  const locals = {}
  async.series([
    (callback) => {
      // Create pass
      User.createPassword(params, (err, response) => {
        // Success
        if (response.status === 'success')
          callback()
        else {
          AppStore.data.submitting = false
          AppStore.data.errors = true
          AppStore.data.show_message = true
          AppStore.data.request_error = true
          AppStore.emitChange()
        }
      })
    },
    (callback) => {
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
        AppStore.data.user = user
        AppStore.emitChange()
        callback()
      })
    },
    (callback) => {
      // Edit first / last name
      const local_user = locals.user
      const user_info = {
        first_name,
        last_name
      }
      // Phone shadow user
      if (new_email)
        user_info.email = new_email
      const params_edit = {
        access_token: local_user.access_token,
        user: user_info
      }
      if (new_email)
        params_edit.email = new_email
      User.edit(params_edit, (err, response_edit) => {
        // Success
        if (response_edit.status === 'success')
          callback()
        else {
          // Error
          AppStore.data.submitting = false
          AppStore.data.errors = true
          AppStore.data.show_message = true
          AppStore.data.request_error = true
          AppStore.emitChange()
        }
      })
    },
    () => {
      // Phone shadow
      if (new_email) {
        User.signout({}, () => {
          AppStore.data.show_confirm_email_modal = true
          AppStore.data.signup.email = new_email
          AppStore.emitChange()
        })
      }
      // Signin with new edited info
      const params_signin_again = {
        email,
        password
      }
      User.signin(params_signin_again, (err, response) => {
        const user = response.data
        AppStore.data.user = user
        AppStore.emitChange()
      })
    }
  ])
}