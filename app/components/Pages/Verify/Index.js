// Verify/index.js
import React, { Component } from 'react'
import Email from './Partials/Email'
import Phone from './Partials/Phone'
import AppDispatcher from '../../../dispatcher/AppDispatcher'
import AppStore from '../../../stores/AppStore'
export default class Verify extends Component {

  componentDidMount() {
    // Reset data store
    AppStore.data = {}
    AppStore.emitChange()
  }

  handleSubmit(code, token) {
    AppDispatcher.dispatch({
      action: 'verify-phone',
      code,
      token
    })
  }

  render() {
    // Data
    const data = this.props.data
    const slug = this.props.params.slug

    let main_content
    if (slug === 'email') {
      main_content = (
        <Email data={data} />
      )
    }

    if (slug === 'phone') {
      main_content = (
        <Phone data={data} handleSubmit={this.handleSubmit} />
      )
    }

    return (
      <div id="main-content" className="container">
        <div className="text-center">
          <h1 className="tempo">Verify</h1>
          { main_content }
        </div>
      </div>
    )
  }
}

// PropTypes
Verify.propTypes = {
  data: React.PropTypes.object,
  params: React.PropTypes.object.isRequired
}