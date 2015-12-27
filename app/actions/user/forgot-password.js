// actions/forgot-password.js
import User from '../../models/User'
import AppStore from '../../stores/AppStore'
import validator from 'validator'

export default (email) => {
  if (!validator.isEmail(email)) {
    AppStore.data = {
      submitting: false,
      errors: true,
      show_message: true,
      email_invalid: true
    }
    AppStore.emitChange()
  } else {
    const params = {
      email
    }
    User.forgotPassword(params, (err, response) => {
      // Success
      if (response.status === 'success') {
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
}