// actions/upgrade-account.js
import User from '../../models/User'
import AppStore from '../../stores/AppStore'
import async from 'async'
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
      // During settings edit
      if (AppStore.data.settings)
        AppStore.data.settings.is_agent = true
      // During signup
      if (AppStore.data.signup) {
        // Sign in for new agent token
        const params_signin = {
          email: AppStore.data.signup.login.email,
          password: AppStore.data.signup.login.password
        }
        User.signin(params_signin, (err_signin, response_signin) => {
          AppStore.data.signup.is_agent = true
          AppStore.emitChange()
        })
      }
    }
    delete AppStore.data.submitting
    AppStore.emitChange()
  })
}