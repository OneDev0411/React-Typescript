// Notifications.js
import React, { Component } from 'react'

export default class Notifications extends Component {
  render() {
    return (
      <div id="main-content" className="container">
        <div className="text-center col-sm-12">
          <h1>Notifications</h1>
        </div>
      </div>
    )
  }
}

// PropTypes
Notifications.propTypes = {
  data: React.PropTypes.object
}