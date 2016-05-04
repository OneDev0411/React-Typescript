// actions/upgrade-account.js
import User from '../../models/User'
import AppStore from '../../stores/AppStore'

export default (user, agent, secret) => {
  let access_token
  if (user)
    access_token = user.access_token
  const params = {
    access_token,
    agent,
    secret
  }
  User.upgradeAccount(params, (err, response) => {
    if (AppStore.data.signup)
      delete AppStore.data.signup.is_agent
    if (AppStore.data.settings)
      delete AppStore.data.settings.is_agent
    // Success
    if (response.status === 'success') {
      const new_user = {
        ...response.data,
        access_token: user.access_token
      }
      AppStore.data.user = new_user
      if (AppStore.data.settings)
        AppStore.data.settings.is_agent = true
      if (AppStore.data.signup)
        AppStore.data.signup.is_agent = true
    } else {
      AppStore.data.errors = {
        update_error: true
      }
    }
    delete AppStore.data.submitting
    AppStore.emitChange()
  })
}