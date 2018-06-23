import { addNotification as notify } from 'reapop'
import api from '../../../models/listings/alerts/'
import { normalize } from 'normalizr'
import * as schema from '../../../models/listings/schema'
import {
  FETCH_CHANGE_ALERT_FOLLOW_REQUEST,
  FETCH_CHANGE_ALERT_FOLLOW_SUCCESS,
  FETCH_CHANGE_ALERT_FOLLOW_FAILURE
} from '../../../constants/listings/alerts'
import { selectAlert } from '../../../reducers/listings/alerts/list'

const changeAlertFollowStatuses = (id, statuses) => async (
  dispatch,
  getState
) => {
  const {
    alerts: { list }
  } = getState()

  const oldAlert = selectAlert(list, id)

  try {
    const normalizedAlert = {
      ...normalize([{ ...oldAlert, isFetching: true }], schema.listingsList)
    }

    dispatch({
      response: normalizedAlert,
      tabName: 'alerts',
      type: FETCH_CHANGE_ALERT_FOLLOW_REQUEST
    })

    const response = await api.changeAlertFollowStatuses(id, statuses)

    const newAlert = { ...response.body.data, isFetching: false }

    const normalizedResponse = {
      ...normalize([newAlert], schema.listingsList)
    }

    dispatch({
      response: normalizedResponse,
      tabName: 'alerts',
      type: FETCH_CHANGE_ALERT_FOLLOW_SUCCESS
    })
  } catch ({ response, message }) {
    const ErrorMessage =
      (response && response.body.message) || message || 'Something went wrong.'

    dispatch(
      notify({
        title: 'Server Error',
        message: ErrorMessage,
        status: 'error'
      })
    )

    const normalizedAlert = {
      ...normalize([{ ...oldAlert, isFetching: false }], schema.listingsList)
    }

    dispatch({
      response: normalizedAlert,
      tabName: 'alerts',
      type: FETCH_CHANGE_ALERT_FOLLOW_FAILURE
    })
  }
}

export default changeAlertFollowStatuses
