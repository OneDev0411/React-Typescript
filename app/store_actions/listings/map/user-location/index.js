import { batchActions } from 'redux-batched-actions'
import { addNotification as notify } from 'reapop'

import { isLocationInTX } from 'utils/map'

import * as types from '../../../../constants/listings/map'
import { mapInitialState } from '../../../../constants/listings/options'

import { setMapProps } from '..'

function setPosition(location) {
  const {
    coords: { latitude: lat, longitude: lng }
  } = location
  const zoom = mapInitialState.zoom

  // If the user is outside of Dallas, we move it to Dallas.
  // The below area is locating the Dallas.
  // These points are consistent with the iOS app:
  // https://gitlab.com/rechat/web/issues/1022#note_67523348

  if (isLocationInTX(lat, lng)) {
    return [
      setMapProps('search', {
        center: { lat, lng },
        zoom
      }),
      { type: types.GET_USER_LOCATION_DONE, tabName: 'search' }
    ]
  }

  return [
    notify({
      message: "We aren't support your location. You are out of Texas state!",
      status: 'error'
    }),
    setMapProps('search', {
      center: mapInitialState.center,
      zoom
    })
  ]
}

const showError = error => dispatch => {
  let message

  dispatch({ type: types.GET_USER_LOCATION_DONE, tabName: 'search' })

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
    default:
      message = error.message
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
  if (window && 'geolocation' in window.navigator) {
    dispatch({ type: types.START_GET_USER_LOCATION, tabName: 'search' })
    navigator.geolocation.getCurrentPosition(
      location => {
        batchActions([...setPosition(location).map(action => dispatch(action))])
      },
      error => {
        console.log(error)
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
