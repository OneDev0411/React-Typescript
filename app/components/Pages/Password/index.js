// Password/index.js
import React, { Component } from 'react'

// AppDispatcher
import AppDispatcher from '../../../dispatcher/AppDispatcher'

// AppStore
import AppStore from '../../../stores/AppStore'

// Partials
import BigHeading from '../../Partials/BigHeading'
import Forgot from './Partials/Forgot'
import Reset from './Partials/Reset'

export default class Password extends Component {

  componentDidMount() {
    // Reset data store
    AppStore.data = {}
    AppStore.emitChange()
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
  }

  render() {
    // Data
    const data = AppStore.data
    const slug = this.props.params.slug

    let main_content
    if (slug === 'forgot') {
      main_content = (
        <Forgot handleSubmit={ this.handleSubmit } data={ data }/>
      )
    }

    if (slug === 'reset') {
      main_content = (
        <Reset handleSubmit={ this.handleSubmit } data={ data }/>
      )
    }

    return (
      <div id="main-content" className="container">
        <div className="text-center">
          <BigHeading />
          { main_content }
        </div>
      </div>
    )
  }
}

// PropTypes
Password.propTypes = {
  data: React.PropTypes.object,
  params: React.PropTypes.object.isRequired
}