import React, { Component } from 'react'
import { connect } from 'react-redux'
import idx from 'idx'
import * as Sentry from '@sentry/browser'

import getBrand from '../../../store_actions/brand'
import getFavorites from '../../../store_actions/listings/favorites/get-favorites'

class App extends Component {
  componentDidMount() {
    const { brand, user } = this.props

    if (window) {
      require('offline-js')
    }

    if (!brand) {
      this.props.getBrand(idx(this.props, props => props.location.query.brand))
    }

    if (user) {
      // load saved listings
      this.props.getFavorites(user)

      // set user for full story
      this.setFullStoryUser(user)

      // set user data for sentry
      this.setSentryUser(user, this.props.brand)
    }
  }

  setFullStoryUser(user) {
    if (window.FS) {
      window.FS.identify(user.id, {
        name: user.display_name,
        email: user.email
      })
    }
  }

  setSentryUser(user, brand) {
    Sentry.configureScope(scope => {
      scope.setUser({
        id: user.id,
        email: user.email,
        name: user.display_name,
        brand: brand && {
          id: brand.id,
          name: brand.name
        }
      })
    })
  }

  render() {
    const children = React.cloneElement(this.props.children, {
      brand: this.props.brand,
      user: this.props.user
    })

    return <div>{children}</div>
  }
}

export default connect(
  ({ user, brand }) => ({
    brand,
    user
  }),
  { getFavorites, getBrand }
)(App)
