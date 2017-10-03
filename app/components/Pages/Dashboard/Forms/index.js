import React, { Component } from 'react'
import config from '../../../../../config/public'

export default class Forms extends Component {
  render() {
    // Data
    const data = this.props.data
    const user = data.user

    return (
      <div>
        <iframe
          style={{
            width: '100%',
            height: '99vh'
          }}
          src={`${config.forms.url}?access_token=${user.access_token}`}
          frameBorder="0"
        />
      </div>
    )
  }
}
