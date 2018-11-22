import React, { Component } from 'react'
import { withRouter } from 'react-router'

class Templates extends Component {
  render() {
    const {
      params: { medium, type }
    } = this.props

    return <div>{[medium, type].join(', ')}</div>
  }
}

export default withRouter(Templates)
