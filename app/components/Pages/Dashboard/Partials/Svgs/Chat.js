// Chat.js
import React, { Component } from 'react'
export default class Chat extends Component {
  render() {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid" width="20" height="19" viewBox="0 0 20 19">
        <path fill={this.props.color} fillRule="evenodd" d="M1.175,17.947 C1.043,17.947 0.913,17.893 0.816,17.792 C0.668,17.637 0.632,17.402 0.727,17.209 L2.576,13.450 C0.912,11.964 0.000,10.034 0.000,7.975 C0.000,3.569 4.262,-0.016 9.500,-0.016 C14.738,-0.016 19.000,3.569 19.000,7.975 C19.000,12.382 14.738,15.967 9.500,15.967 C8.435,15.967 7.389,15.819 6.386,15.528 L1.386,17.899 C1.318,17.931 1.246,17.947 1.175,17.947 Z" />
      </svg>
    )
  }
}
Chat.propTypes = {
  color: React.PropTypes.string
}