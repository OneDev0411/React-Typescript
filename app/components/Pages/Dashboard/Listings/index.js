import React, { Component } from 'react'
import Tabs from './components/Tabs'
import { connect } from 'react-redux'

class Listings extends Component {
  render() {
    const isLoggedIn = this.props.user
    return (
      <div className={`l-listings ${isLoggedIn ? 'l-listings--logged' : ''}`}>
        <Tabs isLoggedIn={isLoggedIn} />
        {this.props.children}
      </div>
    )
  }
}

export default connect(({ data }) => ({ user: data.user || false }))(Listings)
