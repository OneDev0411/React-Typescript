import React, { useState } from 'react'

import { makeStyles } from '@material-ui/core'
import { useDispatch } from 'react-redux'
import { RouteComponentProps } from 'react-router'

import { confirmation } from 'actions/confirmation'
import GlobalPageLayout from 'components/GlobalPageLayout'
import { getLocationErrorMessage } from 'utils/map'

import { getUserLastBrowsingLocation } from '../helpers/sort-utils'

import ExplorePage from './components/ExplorePage'
import { LandingPage } from './components/LandingPage'

const useStyles = makeStyles(() => ({
  exploreContainer: {
    display: 'flex',
    minHeight: '100vh',
    flexDirection: 'column',
    paddingTop: 0,
    paddingBottom: 0
  }
}))

interface Props extends RouteComponentProps<any, {}> {
  user: IUser
  isWidget: boolean
}

function Search({ isWidget, user, location: { query } }: Props) {
  const classes = useStyles()

  const dispatch = useDispatch()
  const [searchQuery, setSearchQuery] = useState<string>(query.q || '')
  const brokerageQuery = query.brokerage || ''

  const hasUrlQuery = !!(brokerageQuery || searchQuery)

  const userLastBrowsingLocation = getUserLastBrowsingLocation(user)

  const [state, setState] = useState({
    isGettingCurrentPosition: false,
    userLastBrowsingLocation,
    firstRun:
      typeof userLastBrowsingLocation === 'undefined' ||
      Object.keys(userLastBrowsingLocation).length === 0
  })

  const onClickLocate = () => {
    if (!window.navigator.geolocation) {
      return dispatch(
        confirmation({
          confirmLabel: 'OK',
          message: 'Your device does not support Geolocation',
          hideCancelButton: true
        })
      )
    }

    setState(prev => ({ ...prev, isGettingCurrentPosition: true }))

    navigator.geolocation.getCurrentPosition(
      ({ coords: { latitude: lat, longitude: lng } }) => {
        initUserLocation(lat, lng)
      },
      error => {
        console.log(error)
        console.log(getLocationErrorMessage(error))
        setState(prev => ({ ...prev, isGettingCurrentPosition: false }))
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

  const initUserLocation = (lat: number, lng: number) => {
    setState(prev => ({
      ...prev,
      firstRun: false,
      isGettingCurrentPosition: false,
      userLastBrowsingLocation: {
        zoom: 15,
        center: { lat, lng }
      }
    }))
  }

  const onSelectPlace = () => {
    setSearchQuery(window.location.search.substring(3))
    setState(prev => ({ ...prev, firstRun: false }))
  }

  return (
    <GlobalPageLayout className={classes.exploreContainer}>
      {state.firstRun && !hasUrlQuery && !isWidget ? (
        <LandingPage
          isGettingCurrentPosition={state.isGettingCurrentPosition}
          onClickLocate={onClickLocate}
          onSelectPlace={onSelectPlace}
        />
      ) : (
        <ExplorePage
          query={query}
          userLastBrowsingLocation={state.userLastBrowsingLocation}
        />
      )}
    </GlobalPageLayout>
  )
}

export default Search
