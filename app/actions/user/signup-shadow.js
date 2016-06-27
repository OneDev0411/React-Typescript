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
  // Widgets and subdomain signup
  if (AppStore.data.signup_tooltip) {
    user.actions = []
    if (AppStore.data.signup_tooltip.action === 'listing_inquiry') {
      user.actions.push({
        action: 'listing_inquiry',
        listing: AppStore.data.signup_tooltip.listing
      })
    }
    if (AppStore.data.signup_tooltip.action === 'favorite_listing') {
      user.actions.push({
        action: 'favorite_listing',
        listing: AppStore.data.signup_tooltip.listing
      })
    }
    if (AppStore.data.signup_tooltip.alert) {
      user.actions.push({
        action: 'alert',
        alert: AppStore.data.signup_tooltip.alert
      })
    }
  }
  console.log(user)
  // if (AppStore.data.brand && AppStore.data.brand.subdomain)
  //   user.subdomain = AppStore.data.brand.subdomain
  // // If coming from signup tooltip
  // if (AppStore.data.signup_tooltip && AppStore.data.signup_tooltip.listing_id)
  //   user.listing = AppStore.data.signup_tooltip.listing_id
  // if (AppStore.data.signup_tooltip && AppStore.data.signup_tooltip.list_agent)
  //   user.user_connect = AppStore.data.signup_tooltip.list_agent.user_id
  // // If coming from map
  // if (AppStore.data.signup_tooltip && AppStore.data.signup_tooltip.alert)
  //   user.alert = AppStore.data.signup_tooltip.alert
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
          // Email in use
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