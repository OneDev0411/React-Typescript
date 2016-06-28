// Photos.js
import React, { Component } from 'react'

export default class Photos extends Component {
  render() {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid" width="20" height="19" viewBox="0 0 20 19">
        <path fill={ this.props.color } fillRule="evenodd" d="M17.000,19.000 L11.999,19.000 C10.895,19.000 10.000,18.105 10.000,17.000 L10.000,12.000 C10.000,10.895 10.895,10.000 11.999,10.000 L17.000,10.000 C18.104,10.000 19.000,10.895 19.000,12.000 L19.000,17.000 C19.000,18.105 18.104,19.000 17.000,19.000 ZM17.000,9.000 L11.999,9.000 C10.895,9.000 10.000,8.105 10.000,7.000 L10.000,2.000 C10.000,0.895 10.895,0.000 11.999,0.000 L17.000,0.000 C18.104,0.000 19.000,0.895 19.000,2.000 L19.000,7.000 C19.000,8.105 18.104,9.000 17.000,9.000 ZM7.000,19.000 L2.000,19.000 C0.895,19.000 0.001,18.105 0.001,17.000 L0.001,12.000 C0.001,10.895 0.895,10.000 2.000,10.000 L7.000,10.000 C8.105,10.000 8.999,10.895 8.999,12.000 L8.999,17.000 C8.999,18.105 8.105,19.000 7.000,19.000 ZM7.000,9.000 L2.000,9.000 C0.895,9.000 0.001,8.105 0.001,7.000 L0.001,2.000 C0.001,0.895 0.895,0.000 2.000,0.000 L7.000,0.000 C8.105,0.000 8.999,0.895 8.999,2.000 L8.999,7.000 C8.999,8.105 8.105,9.000 7.000,9.000 Z" />
      </svg>
    )
  }
}
Photos.propTypes = {
  color: React.PropTypes.string
}