import React from 'react'

import { withStyles } from '@material-ui/core/styles'

import { confirmation } from 'actions/confirmation'
import GlobalPageLayout from 'components/GlobalPageLayout'
import { getLocationErrorMessage } from 'utils/map'

import { getUserLastBrowsingLocation } from '../helpers/sort-utils'

import ExplorePage from './ExplorePage'
import { LandingPage } from './LandingPage'

const styles = () => ({
  exploreContainer: {
    display: 'flex',
    minHeight: '100vh',
    flexDirection: 'column',
    paddingTop: 0,
    paddingBottom: 0
  }
})

class Search extends React.Component {
  constructor(props) {
    super(props)

    const { query } = props.location

    this.searchQuery = query.q || ''
    this.brokerageQuery = query.brokerage || ''

    const userLastBrowsingLocation = getUserLastBrowsingLocation(
      this.props.user
    )

    this.state = {
      isGettingCurrentPosition: false,
      userLastBrowsingLocation,
      firstRun:
        true ||
        !userLastBrowsingLocation ||
        Object.keys(userLastBrowsingLocation).length == 0
    }
  }

  onClickLocate = () => {
    const { dispatch } = this.props

    if (!window.navigator.geolocation) {
      return dispatch(
        confirmation({
          confirmLabel: 'OK',
          message: 'Your device does not support Geolocation',
          hideCancelButton: true
        })
      )
    }

    this.setState({ isGettingCurrentPosition: true })

    navigator.geolocation.getCurrentPosition(
      ({ coords: { latitude: lat, longitude: lng } }) => {
        this.initUserLocation(lat, lng)
      },
      error => {
        console.log(error)
        console.log(getLocationErrorMessage(error))
        this.setState({ isGettingCurrentPosition: false })
        dispatch(
          confirmation({
            confirmLabel: 'OK',
            message: 'Your location is disabled',
            description:
              'Please check your browser’s setting and make sure ' +
              'your location sharing is on.',
            hideCancelButton: true
          })
        )
      },
      { timeout: 10000 }
    )
  }

  initUserLocation = (lat, lng) => {
    this.setState({
      firstRun: false,
      isGettingCurrentPosition: false,
      userLastBrowsingLocation: {
        zoom: 15,
        center: { lat, lng }
      }
    })
  }

  onSelectPlace = () => {
    this.searchQuery = window.location.search.substring(3)
    this.setState({ firstRun: false })
  }

  render() {
    const { classes, isWidget, location } = this.props
    const { firstRun, isGettingCurrentPosition } = this.state
    const hasUrlQuery = !!(this.brokerageQuery || this.searchQuery)

    return (
      <GlobalPageLayout className={classes.exploreContainer}>
        {firstRun && !hasUrlQuery && !isWidget ? (
          <LandingPage
            isGettingCurrentPosition={isGettingCurrentPosition}
            onClickLocate={this.onClickLocate}
            onSelectPlace={this.onSelectPlace}
          />
        ) : (
          <ExplorePage
            query={location.query}
            userLastBrowsingLocation={this.state.userLastBrowsingLocation}
          />
        )}
      </GlobalPageLayout>
    )
  }
}

export default withStyles(styles, { withTheme: true })(Search)

// todo: refactor initmap when there is a querystring
