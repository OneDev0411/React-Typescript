// controller/action-bubble.js
import AppStore from '../../../../stores/AppStore'
import AppDispatcher from '../../../../dispatcher/AppDispatcher'
import validator from 'validator'
import { randomString } from '../../../../utils/helpers'
const controller = {
  handleCloseSignupForm() {
    delete AppStore.data.signup_tooltip
    AppStore.emitChange()
  },
  showIntercom(e) {
    e.preventDefault()
    window.Intercom('show')
  },
  handleListingInquirySubmit(e) {
    const data = AppStore.data
    const user = data.user
    AppStore.data.submitting = true
    AppStore.emitChange()
    e.preventDefault()
    AppDispatcher.dispatch({
      action: 'listing-inquiry',
      user,
      agent: data.signup_tooltip.list_agent.id,
      listing: data.signup_tooltip.listing
    })
  },
  handleEmailSubmit(e) {
    // If clicked
    // setTimeout(() => {
    //   this.refs.email.refs.input.focus()
    // }, 100)
    e.preventDefault()
    delete AppStore.data.errors
    AppStore.emitChange()
    const data = this.props.data
    const email = this.emailInput.value
    // If no email or double submit
    if (!email || data.submitting)
      return
    const random_password = randomString(9)
    if (!email.trim())
      return
    if (!validator.isEmail(email)) {
      AppStore.data.errors = {
        type: 'email-invalid'
      }
      AppStore.emitChange()
      setTimeout(() => {
        delete AppStore.data.errors
        AppStore.emitChange()
      }, 3000)
      return
    }
    AppStore.data.submitting = true
    AppStore.emitChange()
    const user = {
      first_name: email,
      email,
      user_type: 'Client',
      password: random_password,
      grant_type: 'password',
      is_shadow: true
    }
    AppDispatcher.dispatch({
      action: 'sign-up-shadow',
      user,
      redirect_to: ''
    })
  },
  hideModal() {
    delete AppStore.data.errors
    delete AppStore.data.show_signup_confirm_modal
    delete AppStore.data.signup_tooltip
    AppStore.emitChange()
  },
  handleAgentClick(listing) {
    delete AppStore.data.show_signup_confirm_modal
    AppStore.data.signup_tooltip = {
      action: 'listing_inquiry',
      list_agent: listing.proposed_agent,
      listing: listing.id
    }
    AppStore.emitChange()
  },
  handleBrandAgentClick(listing, brand_agent) {
    AppStore.data.signup_tooltip = {
      action: 'listing_inquiry',
      list_agent: brand_agent,
      listing: listing.id
    }
    AppStore.emitChange()
  },
  handleLoginClick(listing_id) {
    const data = this.props.data
    const url = `https://${data.brand.hostnames[0]}/signin?redirect_to=dashboard/mls/${listing_id}`
    window.top.location.href = url
  },
  resend(e) {
    e.preventDefault()
    const data = this.props.data
    const new_user = data.new_user
    const user = {
      first_name: new_user.email,
      email: new_user.email,
      user_type: 'Client',
      password: new_user.random_password,
      grant_type: 'password',
      is_shadow: true
    }
    AppStore.data.resent_email_confirmation = true
    AppDispatcher.dispatch({
      action: 'sign-up-shadow',
      user,
      redirect_to: ''
    })
  }
}
export default controller
