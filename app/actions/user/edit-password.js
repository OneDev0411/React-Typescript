// actions/user/edit-password.js
import User from '../../models/User'
import AppStore from '../../stores/AppStore'

export default (user, old_password, new_password) => {
  const params = {
    access_token: user.access_token,
    old_password,
    new_password
  }
  User.editPassword(params, (err, response) => {
    delete AppStore.data.saving_account_settings
    if (response.status === 'success')
      AppStore.data.password_changed = true
    if (response.status === 'error') {
      AppStore.data.error = {
        message: `There was an error with your password`
      }
    }
    AppStore.emitChange()
  })
}