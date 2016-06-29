// Map.js
import React, { Component } from 'react'
export default class Map extends Component {
  render() {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid" width="20" height="19" viewBox="0 0 20 19">
        <path fill={ this.props.color } fillRule="evenodd" d="M18.729,18.882 C18.657,18.920 18.578,18.938 18.500,18.938 C18.397,18.938 18.296,18.907 18.210,18.845 L13.000,15.135 L13.000,0.236 L18.790,4.360 C18.922,4.453 19.000,4.604 19.000,4.765 L19.000,18.439 C19.000,18.626 18.895,18.797 18.729,18.882 ZM12.000,15.135 L7.000,18.696 L7.000,3.797 L12.000,0.236 L12.000,15.135 ZM0.000,14.166 L0.000,0.492 C0.000,0.305 0.105,0.134 0.271,0.049 C0.437,-0.037 0.638,-0.022 0.791,0.087 L6.000,3.797 L6.000,18.696 L0.210,14.572 C0.078,14.478 0.000,14.328 0.000,14.166 Z" />
      </svg>
    )
  }
}
Map.propTypes = {
  color: React.PropTypes.string
}