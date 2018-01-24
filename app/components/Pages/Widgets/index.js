import React, { Component } from 'react'
import { connect } from 'react-redux'

// favorites
import getFavorites from '../../../store_actions/listings/favorites/get-favorites'

class App extends Component {
  componentDidMount() {
    const {
      data, user
    } = this.props


    if (window) {
      require('offline-js')
    }

    if (user) {
      // load saved listings
      this.props.getFavorites(user)

      // set user for full story
      this.setFullStoryUser(user)

      // set user data for sentry
      this.setSentryUser(user, data.brand)
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
    if (window.Raven) {
      const { email, id } = user
      const userData = {
        id,
        email,
        name: user.display_name,
        brand: brand && {
          id: brand.id,
          name: brand.name
        }
      }

      window.Raven.setUserContext(userData)
    }
  }


  render() {
    const {
      data, user
    } = this.props


    const children = React.cloneElement(this.props.children, {
      data,
      user
    })


    return (
      <div>
        {children}
      </div>
    )
  }
}

export default connect(({
  user, data
}) => ({
  data,
  user
}), { getFavorites })(App)
