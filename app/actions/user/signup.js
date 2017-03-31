// actions/signup.js
import User from '../../models/User'
import AppStore from '../../stores/AppStore'
import validator from 'validator'
import async from 'async'
export default (user, password, confirm_password, redirect_to) => {
  let email_trim
  let password_trim
  let confirm_password_trim
  const email = user.email
  if (email && password && confirm_password) {
    email_trim = user.email.trim()
    password_trim = password.trim()
    confirm_password_trim = confirm_password.trim()
  }
  const first_name = user.first_name.trim()
  const last_name = user.last_name.trim()
  /* Handle errors
  ==================== */
  let error_type
  let password_error
  // Validation
  if (!validator.isEmail(email_trim) || password_trim.length < 6 || password_trim !== confirm_password_trim || !first_name || !last_name) {
    if (!validator.isEmail(email_trim))
      error_type = 'email'

    if (error_type !== 'email') {
      if (password_trim.length < 6) {
        error_type = 'password'
        password_error = 'too-short'
      }
      if (password_trim !== confirm_password_trim) {
        error_type = 'password'
        password_error = 'no-match'
      }
    }
    if (!first_name)
      error_type = 'first_name'
    if (!last_name)
      error_type = 'last_name'
    delete AppStore.data.submitting
    AppStore.data.errors = true
    AppStore.data.show_message = true
    AppStore.data.error_type = error_type
    AppStore.data.password_error = password_error
    return AppStore.emitChange()
  }
  // Set trimmed data
  user.email = email_trim
  user.password = password_trim
  // Check for inviting_user
  if (AppStore.data.signup.inviting_user)
    user.user_connect = AppStore.data.signup.inviting_user
  // Add brand
  if (AppStore.data.brand)
    user.brand = AppStore.data.brand.id
  let params = {
    user
  }
  const locals = {}
  async.series([
    (callback) => {
      User.create(params, (err, response) => {
        if (err) {
          // Bad request
          if (err.response.status === 400) {
            AppStore.data = {
              submitting: false,
              errors: true,
              error_type: 'server',
              show_message: true,
              response: 'bad-request'
            }
          }
          // Conflict
          if (err.response.status === 409) {
            AppStore.data = {
              submitting: false,
              errors: true,
              error_type: 'server',
              show_message: true,
              response: 'email-in-use'
            }
          }
          AppStore.emitChange()
        }
        // Success
        if (response && response.status === 'success') {
          const new_user = response.data
          AppStore.data = {
            status: 'success',
            show_message: true,
            new_user,
            redirect_to
          }
          AppStore.emitChange()
          callback()
        }
      })
    },
    (callback) => {
      params = {
        email: user.email,
        password: user.password
      }
      User.signin(params, (err, response) => {
        const data = response.data
        locals.access_token = data.access_token
        callback()
      })
    },
    () => {
      params = {
        access_token: locals.access_token
      }
      User.sendVerifyEmail(params, () => {})
    }
  ])
}