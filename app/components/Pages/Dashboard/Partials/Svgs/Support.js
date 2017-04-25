// Support.js
import React, { Component } from 'react'
export default class Map extends Component {
  render() {
    return (
      <svg width={this.props.width || 24} height={this.props.height || 24} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
        <path fill={this.props.color} fillRule="evenodd" d="M23 14h-5.882c.243-.622.382-1.294.382-2s-.139-1.378-.382-2H23v4zm-11 2.5c-2.481 0-4.5-2.02-4.5-4.5 0-2.482 2.019-4.5 4.5-4.5s4.5 2.018 4.5 4.5c0 2.48-2.019 4.5-4.5 4.5zm2 6.5h-4v-5.883c.62.244 1.294.383 2 .383s1.379-.139 2-.383V23zm-7.118-9H1v-4h5.882c-.243.622-.382 1.294-.382 2s.139 1.378.382 2zM10 1h4v5.88c-.621-.241-1.294-.38-2-.38s-1.38.139-2 .38V1zm13.5 8h-.92C21.542 5.343 18.657 2.458 15 1.418V.5c0-.277-.224-.5-.5-.5h-5c-.276 0-.5.223-.5.5v.918C5.343 2.458 2.457 5.343 1.419 9H.5c-.276 0-.5.223-.5.5v5c0 .276.224.5.5.5h.919C2.457 18.657 5.343 21.542 9 22.582v.918c0 .276.224.5.5.5h5c.276 0 .5-.224.5-.5v-.918c3.657-1.04 6.542-3.925 7.58-7.582h.92c.276 0 .5-.224.5-.5v-5c0-.277-.224-.5-.5-.5z"/>
      </svg>
    )
  }
}
Map.propTypes = {
  color: React.PropTypes.string
}