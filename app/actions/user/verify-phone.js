// actions/verify-phone.js
import User from '../../models/User'
import AppStore from '../../stores/AppStore'

export default (code, token) => {
  if (!code || !token) {
    let error_type
    if (!code)
      error_type = 'invalid-code'

    if (!token)
      error_type = 'invalid-token'

    AppStore.data = {
      submitting: false,
      errors: true,
      show_message: true,
      error_type
    }
    return AppStore.emitChange()
  }

  const params = {
    code,
    token
  }

  User.verifyPhone(params, (err, response) => {
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
        request_error: true
      }
    }
    AppStore.emitChange()
  })
}