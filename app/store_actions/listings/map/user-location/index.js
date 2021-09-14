import { batchActions } from 'redux-batched-actions'

import { confirmation } from 'actions/confirmation'
import { DEFAULT_ZOOM } from 'constants/listings/defaults'
import * as types from 'constants/listings/map'
import { getLocationErrorMessage } from 'utils/map'

import { setMapProps } from '..'

export const getLocation = () => dispatch => {
  if (window && 'geolocation' in window.navigator) {
    dispatch({ type: types.START_GET_USER_LOCATION, tabName: 'search' })

    navigator.geolocation.getCurrentPosition(
      location => {
        const {
          coords: { latitude: lat, longitude: lng }
        } = location

        batchActions([
          dispatch(
            setMapProps('search', {
              center: { lat, lng },
              zoom: DEFAULT_ZOOM
            })
          ),
          dispatch({ type: types.GET_USER_LOCATION_DONE, tabName: 'search' })
        ])
      },
      error => {
        dispatch({ type: types.GET_USER_LOCATION_DONE, tabName: 'search' })
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
        console.log(getLocationErrorMessage(error))
      },
      { timeout: 5000 }
    )
  } else {
    dispatch(
      confirmation({
        confirmLabel: 'OK',
        message: 'Your device does not support Geolocation',
        hideCancelButton: true
      })
    )
  }
}
