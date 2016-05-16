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
    // Error
    if (response.status !== 'success') {
      AppStore.data.errors = {
        update_error: true
      }
    }
    // Success
    if (response.status === 'success') {
      const new_user = {
        ...response.data,
        access_token: user.access_token
      }
      AppStore.data.user = new_user
      // Settings edit
      if (AppStore.data.settings)
        AppStore.data.settings.is_agent = true
      // Signup
      if (AppStore.data.signup) {
        // Sign in for new agent token
        const params_signin = {
          email: AppStore.data.signup.login.email,
          password: AppStore.data.signup.login.password
        }
        User.signin(params_signin, () => {
          AppStore.data.signup.is_agent = true
          AppStore.emitChange()
        })
      }
    }
    delete AppStore.data.submitting
    AppStore.emitChange()
  })
}