import React, { Component } from 'react'
import Tabs from './components/Tabs'

export default class Listings extends Component {
  render() {
    return (
      <div className="l-listings">
        <Tabs />
        {this.props.children}
      </div>
    )
  }
}