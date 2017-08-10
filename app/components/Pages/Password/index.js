// Password/index.js
import React, { Component } from 'react'
import { browserHistory } from 'react-router'
import AppDispatcher from '../../../dispatcher/AppDispatcher'
import AppStore from '../../../stores/AppStore'
// import MapBackground from '../../Partials/MapBackground'
import Forgot from './Partials/Forgot'
import Reset from './Partials/Reset'
import Create from './Partials/Create'
import S from 'shorti'
import { Modal } from 'react-bootstrap'
import Loading from '../../Partials/Loading'

export default class Password extends Component {
  componentWillMount() {
    // If has action in url
    const data = this.props.data
    const user = data.user
    if (user && user.id
      && data.location && data.location.query && data.location.query.action) {
      const url = this.getActionRedirectURL()
      if (window.location.href !== url) {
        delete AppStore.data.show_logout_message
        AppStore.data.show_password_loading = true
        AppStore.emitChange()
        window.location.href = url
      }
    }
  }
  componentDidMount() {
    this.getReceivingUser()
  }
  componentDidUpdate() {
    const url = this.getActionRedirectURL()
    this.checkIsShadowUser()
    const data = this.props.data
    const signup = data.signup
    const user = data.user
    // If user logged in on mount
    if (user && user.id && signup && !signup.form_submitted && !data.show_logout_message) {
      AppStore.data.show_logout_message = true
      AppStore.emitChange()
    }
    // Redirect after Password creation
    if (!url && user && signup && signup.form_submitted) {
      // If invited to room
      if (data.current_room && AppStore.data.signup.login_done) {
        window.location.href = `/dashboard/recents/${data.current_room.id}`
        return
      }
      if (signup.type === 'client' && AppStore.data.signup.login_done) {
        window.location.href = '/dashboard/mls?message=welcome'
      }
      if (signup.type === 'agent') {
        // If verified agent
        if (signup.is_agent) {
          window.location.href = '/dashboard/mls?message=welcome'
          return
        }
        delete AppStore.data.submitting
        AppStore.emitChange()
        // Go to confirm agent
        browserHistory.push('/signup/agent')
      }
    }
    // If has action in url
    if (user && user.id
      && data.location && data.location.query && data.location.query.action
    && !data.signup.loading_submit) {
      if (window.location.href !== url) {
        if (AppStore.data.show_logout_message) {
          delete AppStore.data.show_logout_message
          AppStore.emitChange()
        }
        window.location.href = url
      }
    }
  }
  getActionRedirectURL() {
    // If has action in url
    let action
    let listing_id
    let room_id
    let alert_id
    let room
    let listing
    let alert
    const data = this.props.data
    if (data.location && data.location.query && data.location.query.action) {
      action = data.location.query.action
      if (data.location.query.listing_id)
        listing_id = data.location.query.listing_id
      if (data.location.query.room_id)
        room_id = data.location.query.room_id
      if (data.location.query.alert_id)
        alert_id = data.location.query.alert_id
      // New branch data
      if (data.location.query.room)
        room = data.location.query.room
      if (data.location.query.listing)
        listing = data.location.query.listing
      if (data.location.query.alert)
        alert = data.location.query.alert
      if (action === 'favorite_listing' && listing_id)
        return `/dashboard/mls/${listing_id}`
      if (action === 'listing_inquiry' && room_id)
        return `/dashboard/recents/${room_id}`
      if (action === 'create_alert' && alert_id)
        return `/dashboard/mls/alerts/${alert_id}`
      // New branch actions
      if (action === 'RedirectToRoom' && room)
        return `/dashboard/recents/${room}`
      if (action === 'RedirectToListing' && listing)
        return `/dashboard/mls/${listing}`
      if (action === 'RedirectToAlert' && alert)
        return `/dashboard/mls/alerts/${alert}`
    }
  }
  getReceivingUser() {
    const data = this.props.data
    if (!data.location.query.receiving_user)
      return
    const user_id = decodeURIComponent(data.location.query.receiving_user)
    AppDispatcher.dispatch({
      action: 'get-receiving-user',
      user_id
    })
  }
  checkIsShadowUser() {
    const data = this.props.data
    const receiving_user = data.receiving_user
    if (receiving_user) {
      if (!receiving_user.is_shadow) {
        const redirect_url = encodeURIComponent(this.getActionRedirectURL())
        window.location.href = `/signin?email=${encodeURIComponent(receiving_user.email)}&redirect_to=${redirect_url}`
      }
    }
  }
  handleSubmit(action, form_data) {
    if (!AppStore.data.signup)
      AppStore.data.signup = {}
    AppStore.data.signup.form_submitted = true
    AppStore.data.signup.loading_submit = true
    AppStore.emitChange()
    // Forgot pass
    if (action === 'forgot-password') {
      const email = form_data.email
      AppDispatcher.dispatch({
        action: 'forgot-password',
        email
      })
    }
    // Reset pass
    if (action === 'reset-password') {
      const password = form_data.password
      const confirm_password = form_data.confirm_password
      const token = form_data.token
      AppDispatcher.dispatch({
        action: 'reset-password',
        password,
        confirm_password,
        token
      })
    }
    // Reset pass
    if (action === 'create-password') {
      const password = form_data.password
      const token = form_data.token
      const email = form_data.email
      const first_name = form_data.first_name
      const last_name = form_data.last_name
      const agent = form_data.agent
      const new_email = form_data.new_email
      const phone_number = form_data.phone_number
      AppDispatcher.dispatch({
        action: 'create-password',
        password,
        token,
        email,
        phone_number,
        first_name,
        last_name,
        agent,
        new_email
      })
    }
  }

  handleSendVerificationAgain() {
    const data = this.props.data
    const email = data.forgot_password.email
    AppDispatcher.dispatch({
      action: 'forgot-password-resend',
      email
    })
  }

  render() {
    // Data
    const data = AppStore.data
    const { location } = this.props
    const { slug } = this.props.params
    let email_area
    let phone_number_area

    if (data.show_logout_message) {
      return (
        <Modal dialogClassName={data.is_mobile ? 'modal-mobile' : ''} show={data.show_logout_message}>
          <div style={S('text-center font-40 p-40 color-666')}>
            <div style={S('bg-2196f3 w-165 h-165 br-100 center-block pt-35')}>
              <i className={`fa fa-${email_area ? 'envelope' : 'phone'}`} style={S('h-70 mt-20 color-fff font-60')} />
            </div>
            <div className="din">Logout to Activate This New Account</div>
            { email_area }
            { phone_number_area }
            <div style={S('text-center')}>
              <a href={`/signout?redirect_to=${encodeURIComponent(window.location.href)}`} className="btn btn-primary">Log out</a>
            </div>
          </div>
        </Modal>
      )
    }
    let main_content
    if (slug === 'forgot') {
      main_content = (
        <Forgot handleSendVerificationAgain={this.handleSendVerificationAgain.bind(this)} handleSubmit={this.handleSubmit} data={data} />
      )
    }

    if (slug === 'reset') {
      main_content = (
        <Reset handleSubmit={this.handleSubmit} data={data} />
      )
    }

    if (slug === 'create') {
      main_content = (
        <Create handleSubmit={this.handleSubmit} data={data} />
      )
    }
    return (
      <div>
        {data.show_password_loading &&
        <Loading />
        }
        <div style={data.show_password_loading ? { opacity: 0 } : {}}>
      <div id="main-content" className="flex-center-wrap" style={S('absolute h-100p w-100p')}>
        <div style={S('z-100 relative mt-60n bg-fff br-6')}>
          { main_content }
        </div>
        <Modal dialogClassName={data.is_mobile ? 'modal-mobile' : ''} show={data.show_confirm_email_modal}>
          <div className="din" style={S('text-center font-60 p-40 color-666')}>
            <div style={S('bg-2196f3 w-165 h-165 br-100 center-block pt-35')}>
              <i className="fa fa-envelope" style={S('h-70 mt-20 color-fff')} />
            </div>
            <div>Email Verification Sent!</div>
            <div style={S('font-20')}>Please check your email:</div>
            <div style={S('color-2196f3 font-20')}>{ data.signup && data.signup.email ? data.signup.email : '' }</div>
          </div>
        </Modal>
      </div>
        </div>
      </div>
    )
  }
}

// PropTypes
Password.propTypes = {
  data: React.PropTypes.object,
  params: React.PropTypes.object.isRequired,
  location: React.PropTypes.object.isRequired
}
