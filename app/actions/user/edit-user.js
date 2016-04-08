// actions/edit-user.js
import User from '../../models/User'
import AppStore from '../../stores/AppStore'

export default (user, user_info) => {
  let params = {
    access_token: user.access_token,
    user: user_info
  }
  User.edit(params, (err, response) => {
    // Success
    if (response.status === 'success') {
      const new_user = {
        ...response.data,
        access_token: user.access_token
      }
      AppStore.data.user = new_user
      delete AppStore.data.saving_account_settings
      delete AppStore.data.show_account_settings_modal
      AppStore.emitChange()
    } else {
      delete AppStore.data.saving_account_settings
      AppStore.emitChange()
    }
    // Check if email and new email are different
    if (user.email !== user_info.email) {
      params = {
        access_token: user.access_token
      }
      User.sendVerifyEmail(params, () => {})
    }
  })
}