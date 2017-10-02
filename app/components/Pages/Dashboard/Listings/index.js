import React, { Component } from 'react'
import { connect } from 'react-redux'

import Tabs from './components/Tabs'
import BrandLogo from './Listing/components/BrandLogo'

class Listings extends Component {
  componentDidMount() {
    // for overwrite css styles (google suggestion)
    document.body.setAttribute('data-page', 'mls')
  }

  render() {
    const { user } = this.props

    return (
      <div className={`l-listings ${user ? 'l-listings--logged' : ''}`}>
        <header className="l-listings__header">
          {!user
            ? <BrandLogo
              styles={{ padding: '.9rem 2rem' }}
            />
            : <Tabs />}
        </header>
        {this.props.children}
      </div>
    )
  }
}

export default connect(
  ({ user }) => ({ user })
)(Listings)
