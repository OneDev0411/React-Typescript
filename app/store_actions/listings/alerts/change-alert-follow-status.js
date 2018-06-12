import { addNotification as notify } from 'reapop'
import api from '../../../models/listings/alerts/'
import {
  FETCH_CHANGE_ALERT_FOLLOW_REQUEST,
  FETCH_CHANGE_ALERT_FOLLOW_SUCCESS,
  FETCH_CHANGE_ALERT_FOLLOW_FAILURE
} from '../../../constants/listings/alerts'

const changeAlertFollowStatuses = (id, statuses) => async dispatch => {
  dispatch({
    id,
    tabName: 'ALERTS',
    type: FETCH_CHANGE_ALERT_FOLLOW_REQUEST
  })

  try {
    const response = await api.changeAlertFollowStatuses(id, statuses)

    dispatch({
      alert: response.body.data,
      tabName: 'ALERTS',
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
    dispatch({
      id,
      tabName: 'ALERTS',
      type: FETCH_CHANGE_ALERT_FOLLOW_FAILURE
    })
  }
}

export default changeAlertFollowStatuses
