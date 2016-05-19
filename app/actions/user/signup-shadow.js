// actions/signup-shadow.js
import User from '../../models/User'
import Intercom from '../../models/Intercom'
import AppStore from '../../stores/AppStore'
import async from 'async'
export default (user, redirect_to) => {
  // Check for inviting_user
  const signup = AppStore.data.signup
  if (signup && signup.inviting_user)
    user.user_connect = AppStore.data.signup.inviting_user
  if (signup && signup.phone_number)
    user.phone_number = AppStore.data.signup.phone_number
  if (signup && signup.room)
    user.room_connect = AppStore.data.signup.room
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
          // Bad request
          if (err.response.status === 409) {
            AppStore.data.errors = {
              type: 'email-in-use'
            }
          }
          delete AppStore.data.submitting
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