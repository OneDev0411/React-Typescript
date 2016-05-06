// Password/index.js
import React, { Component } from 'react'
import AppDispatcher from '../../../dispatcher/AppDispatcher'
import AppStore from '../../../stores/AppStore'
// import MapBackground from '../../Partials/MapBackground'
import Forgot from './Partials/Forgot'
import Reset from './Partials/Reset'
import Create from './Partials/Create'
import S from 'shorti'

export default class Password extends Component {

  componentDidUpdate() {
    const data = this.props.data
    const signup = data.signup
    const user = data.user
    // Redirect after Password creation
    if (user) {
      if (signup.type === 'client')
        window.location.href = '/dashboard/mls?message=welcome'
      if (signup.type === 'agent') {
        delete AppStore.data.submitting
        AppStore.emitChange()
        this.props.history.pushState(null, '/signup/agent')
      }
    }
  }

  handleSubmit(action, form_data) {
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
      AppDispatcher.dispatch({
        action: 'create-password',
        password,
        token,
        email,
        first_name,
        last_name
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
    const slug = this.props.params.slug

    let main_content
    if (slug === 'forgot') {
      main_content = (
        <Forgot handleSendVerificationAgain={ this.handleSendVerificationAgain.bind(this) } handleSubmit={ this.handleSubmit } data={ data }/>
      )
    }

    if (slug === 'reset') {
      main_content = (
        <Reset handleSubmit={ this.handleSubmit } data={ data }/>
      )
    }

    if (slug === 'create') {
      main_content = (
        <Create handleSubmit={ this.handleSubmit } data={ data }/>
      )
    }

    return (
      <div id="main-content" className="flex-center-wrap" style={ S('absolute h-100p w-100p') }>
        <div style={ S('z-100 relative mt-60n bg-fff br-6') }>
          { main_content }
        </div>
      </div>
    )
  }
}

// PropTypes
Password.propTypes = {
  data: React.PropTypes.object,
  params: React.PropTypes.object.isRequired,
  history: React.PropTypes.object.isRequired
}