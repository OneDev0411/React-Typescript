import { batchActions } from 'redux-batched-actions'

import * as types from 'constants/listings/map'
import { getLocationErrorMessage } from 'utils/map'
import { DEFAULT_ZOOM } from 'constants/listings/defaults'
import { addNotification as notify } from 'components/notification'

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
        console.log(getLocationErrorMessage(error))
      },
      { timeout: 5000 }
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
