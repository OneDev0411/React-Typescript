// actions/signup-shadow.js
import User from '../../models/User'
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
  // Widgets and hostname signup
  if (AppStore.data.signup_tooltip) {
    user.actions = []
    if (AppStore.data.signup_tooltip.action === 'listing_inquiry') {
      user.actions.push({
        action: 'listing_inquiry',
        listing: AppStore.data.signup_tooltip.listing,
        agent: AppStore.data.signup_tooltip.list_agent.id,
        brand: AppStore.data.brand.id,
        source_type: 'BrokerageWidget'
      })
    }
    if (AppStore.data.signup_tooltip.action === 'favorite_listing') {
      user.actions.push({
        action: 'favorite_listing',
        listing: AppStore.data.signup_tooltip.listing,
        agent: AppStore.data.signup_tooltip.list_agent.id,
        brand: AppStore.data.brand.id,
        source_type: 'BrokerageWidget'
      })
    }
    if (AppStore.data.signup_tooltip.action === 'create_alert') {
      user.actions.push({
        action: 'create_alert',
        alert: AppStore.data.signup_tooltip.alert,
        brand: AppStore.data.brand.id,
        source_type: 'BrokerageWidget'
      })
    }
  }

  // Add brand
  if (AppStore.data.brand)
    user.brand = AppStore.data.brand.id

  // console.log(user)
  const params = {
    user
  }
  async.series([
    (callback) => {
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
          AppStore.emitChange()
          callback()
        }
      })
    }
  ])
}