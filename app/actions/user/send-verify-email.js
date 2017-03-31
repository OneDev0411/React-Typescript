// actions/send-verify-email.js
import User from '../../models/User'
import AppStore from '../../stores/AppStore'

export default (access_token) => {
  const params = {
    access_token
  }
  User.sendVerifyEmail(params, (err, response) => {
    // Success
    if (response.status === 'success')
      AppStore.data.verify_email_sent = true
    AppStore.emitChange()
  })
}