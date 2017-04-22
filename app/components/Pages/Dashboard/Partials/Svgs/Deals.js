// Deals.js
import React, { Component } from 'react'
export default class Map extends Component {
  render() {
    return (
      <svg width={this.props.width || 24} height={this.props.height || 24} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <g fill="none" fillRule="evenodd">
        <g fill={this.props.color}>
          <path d="M17 10.026V5.5a.5.5 0 0 0-.146-.353l-5-5A.502.502 0 0 0 11.5 0H.5a.5.5 0 0 0-.5.5v21a.5.5 0 0 0 .5.5h11.014A7.452 7.452 0 0 1 10 17.5c0-3.967 3.098-7.216 7-7.474zM11 1l5 5h-5V1z"/><path d="M17.5 11a6.507 6.507 0 0 0-6.5 6.5c0 3.584 2.916 6.5 6.5 6.5s6.5-2.916 6.5-6.5c0-3.585-2.916-6.5-6.5-6.5zm0 5.928a1.887 1.887 0 1 1 .5 3.708v.502a.5.5 0 1 1-1 0v-.502a1.887 1.887 0 0 1-1.391-1.815.5.5 0 0 1 1 0 .892.892 0 1 0 .891-.893 1.893 1.893 0 0 1-1.891-1.891c0-.869.592-1.594 1.391-1.814v-.504a.5.5 0 0 1 1 0v.504c.799.22 1.391.945 1.391 1.814a.5.5 0 1 1-1 0 .892.892 0 1 0-.891.891z"/>
        </g>
        <path d="M0 0h24v24H0z"/></g>
      </svg>
    )
  }
}
Map.propTypes = {
  color: React.PropTypes.string
}