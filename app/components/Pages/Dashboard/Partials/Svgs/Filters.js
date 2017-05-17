// Filters.js
import React, { Component } from 'react'

export default class Filters extends Component {
  render() {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid" width="20" height="19" viewBox="0 0 20 19">
        <path fill={this.props.color} fillRule="evenodd" d="M20.001,1.250 C20.001,0.560 19.440,0.000 18.750,0.000 L1.250,0.000 C0.559,0.000 0.000,0.560 0.000,1.250 L0.000,17.750 C0.000,18.440 0.559,19.000 1.250,19.000 L18.750,19.000 C19.440,19.000 20.001,18.440 20.001,17.750 L20.001,1.250 ZM17.101,15.000 L10.375,15.000 C10.182,16.000 9.340,16.667 8.335,16.667 C7.328,16.667 6.486,16.000 6.293,15.000 L2.935,15.000 C2.702,15.000 2.517,14.730 2.517,14.500 C2.517,14.270 2.702,14.000 2.935,14.000 L6.293,14.000 C6.486,13.000 7.328,12.333 8.335,12.333 C9.340,12.333 10.182,13.000 10.375,14.000 L17.101,14.000 C17.330,14.000 17.518,14.270 17.518,14.500 C17.518,14.730 17.330,15.000 17.101,15.000 ZM17.101,10.000 L8.708,10.000 C8.515,11.000 7.673,11.667 6.667,11.667 C5.661,11.667 4.819,11.000 4.627,10.000 L2.935,10.000 C2.702,10.000 2.517,9.730 2.517,9.500 C2.517,9.270 2.702,9.000 2.935,9.000 L4.627,9.000 C4.819,8.000 5.661,7.333 6.667,7.333 C7.673,7.333 8.515,8.000 8.708,9.000 L17.101,9.000 C17.330,9.000 17.518,9.270 17.518,9.500 C17.518,9.730 17.330,10.000 17.101,10.000 ZM17.101,5.000 L12.042,5.000 C11.847,6.000 11.007,6.667 10.001,6.667 C8.993,6.667 8.153,6.000 7.958,5.000 L2.935,5.000 C2.702,5.000 2.517,4.730 2.517,4.500 C2.517,4.270 2.702,4.000 2.935,4.000 L7.958,4.000 C8.153,3.000 8.993,2.333 10.001,2.333 C11.007,2.333 11.847,3.000 12.042,4.000 L17.101,4.000 C17.330,4.000 17.518,4.270 17.518,4.500 C17.518,4.730 17.330,5.000 17.101,5.000 Z" />
      </svg>
    )
  }
}
Filters.propTypes = {
  color: React.PropTypes.string
}