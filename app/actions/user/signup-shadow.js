// actions/signup-shadow.js
import User from '../../models/User'
import Intercom from '../../models/Intercom'
import AppStore from '../../stores/AppStore'
import async from 'async'
export default (user, redirect_to) => {
  // Check for inviting_user
  if (AppStore.data.signup && AppStore.data.signup.inviting_user)
    user.user_connect = AppStore.data.signup.inviting_user
  const params = {
    user
  }
  async.series([
    callback => {
      User.createShadow(params, (err, response) => {
        if (err) {
          // Bad request
          if (err.response.status === 400) {
            AppStore.data.errors = {
              type: 'bad-request'
            }
          }
          AppStore.emitChange()
        }
        // Success
        if (response && response.status === 'success') {
          const new_user = response.data
          AppStore.data.signup = {
            status: 'success'
          }
          delete AppStore.data.signup_email
          delete AppStore.data.submitting
          AppStore.data.new_user = new_user
          AppStore.data.show_signup_confirm_modal = true
          AppStore.data.redirect_to = redirect_to
          // Intercom
          Intercom.signup({ user: new_user }, () => {})
          AppStore.emitChange()
          callback()
        }
      })
    }
  ])
}