import _ from 'underscore'
import * as types from '../../../../constants/listings/map'
import { setMapProps } from '../index'
import Cookies from 'universal-cookie'
import { addNotification as notify } from 'reapop'

const cookies = new Cookies()

function setPosition(location) {
  const { coords } = location
  const { latitude, longitude } = coords
  let center

  // If the user is outside of Dallas, we move it to Dallas.
  // The below area is locating the Dallas.
  // These points are consistent with the iOS app:
  // https://gitlab.com/rechat/web/issues/1022#note_67523348

  if (
    latitude < 33.230351508956 &&
    latitude > 30.3929423199334 &&
    longitude < -96.7 &&
    longitude > -98.5446725385128
  ) {
    center = { lat: latitude, lng: longitude }
  } else {
    center = {
      lat: 32.7767,
      lng: -96.797
    }
  }

  cookies.set('userLocation', center)

  return setMapProps('SEARCH', { center, zoom: 15 })
}

const showError = error => dispatch => {
  let message

  dispatch({ type: types.GET_USER_LOCATION_DONE, tabName: 'SEARCH' })

  switch (error.code) {
    case error.POSITION_UNAVAILABLE:
      message = 'Location information is unavailable.'
      break
    case error.TIMEOUT:
      message = 'The request to get user location timed out.'
      break
    case error.UNKNOWN_ERROR:
      message = 'An unknown error occurred.'
      break
  }

  message &&
    dispatch(
      notify({
        message,
        status: 'error'
      })
    )
}

export const getLocation = () => dispatch => {
  if (navigator.geolocation) {
    dispatch({ type: types.START_GET_USER_LOCATION, tabName: 'SEARCH' })
    navigator.geolocation.getCurrentPosition(
      location => {
        dispatch(setPosition(location))
        dispatch({ type: types.GET_USER_LOCATION_DONE, tabName: 'SEARCH' })
      },
      error => {
        dispatch(showError(error))
      }
    )
  } else {
    dispatch(
      notify({
        message: 'Geolocation is not supported by this browser.',
        status: 'error'
      })
    )
  }
}

export const getLocationFromCookies = () => dispatch => {
  const userLocation = cookies.get('userLocation')

  if (!_.isEmpty(userLocation)) {
    dispatch(setMapProps('SEARCH', { center: userLocation }))
  } else {
    dispatch(getLocation())
  }
}
