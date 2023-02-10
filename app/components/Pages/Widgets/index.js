import React, { Component } from 'react'

import idx from 'idx'
import { connect } from 'react-redux'

import { withRouter } from '@app/routes/with-router'
import { setupSentry } from 'services/sentry'

import getBrand from '../../../store_actions/brand'

class App extends Component {
  componentDidMount() {
    const { brand, user } = this.props

    if (window) {
      require('offline-js')
    }

    if (!brand) {
      this.props.getBrand(
        idx(this.props, props => props.searchParams.get('brand'))
      )
    }

    if (user) {
      // set user for full story
      this.setFullStoryUser(user)

      // set user data for sentry
      setupSentry(user, this.props.brand)
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

  render() {
    const children = React.cloneElement(this.props.children, {
      brand: this.props.brand,
      user: this.props.user
    })

    return <div>{children}</div>
  }
}

export default withRouter(
  connect(
    ({ user, brand }) => ({
      brand,
      user
    }),
    { getBrand }
  )(App)
)
