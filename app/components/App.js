import React from 'react'
import ReactGA from 'react-ga'
import { connect } from 'react-redux'
import { Helmet } from 'react-helmet'
import idx from 'idx'
import * as Sentry from '@sentry/browser'

import getBrand from '../store_actions/brand'
import { getUserTeams } from '../store_actions/user/teams'

import Brand from '../controllers/Brand'

class App extends React.Component {
  componentWillMount() {
    this.props.dispatch(getBrand())

    if (typeof window !== 'undefined') {
      import('offline-js')
    }
  }

  componentDidMount() {
    this.initializeApp()
  }

  async initializeApp() {
    let { user, brand, dispatch } = this.props

    if (user) {
      if (!idx(user, user => user.teams[0].brand.roles)) {
        user = {
          ...user,
          teams: await dispatch(getUserTeams(user))
        }
      }

      // set user for full story
      this.setFullStoryUser(user)

      // set user data for sentry
      this.setSentryUser(user, brand)
    }

    // google analytics
    this.initialGoogleAnalytics(brand)
  }

  initialGoogleAnalytics(brand) {
    if (!window) {
      return
    }

    const analyticsId = Brand.asset(
      'google_analytics_id',
      'UA-56150904-2',
      brand
    )

    const hostname = idx(brand, b => b.hostnames[0])
      ? brand.hostnames[0]
      : window.location.hostname

    const page = window.location.pathname

    ReactGA.initialize(analyticsId)
    ReactGA.ga('create', analyticsId, 'auto', hostname)
    ReactGA.set({ page })
    ReactGA.pageview(page)
  }

  setFullStoryUser(user) {
    if (window && window.FS) {
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
    return (
      <>
        <Helmet>
          <title>Rechat</title>
        </Helmet>
        {this.props.children}
      </>
    )
  }
}

function mapStateToProps(state) {
  return {
    user: state.user
  }
}

export default connect(mapStateToProps)(App)
