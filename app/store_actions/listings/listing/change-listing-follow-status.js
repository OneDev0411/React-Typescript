import { addNotification as notify } from 'reapop'
import api from '../../../models/listings/listing'
import {
  FETCH_CHANGE_LISTING_FOLLOW_REQUEST,
  FETCH_CHANGE_LISTING_FOLLOW_SUCCESS,
  FETCH_CHANGE_LISTING_FOLLOW_FAILURE
} from '../../../constants/listings/listing'

const changeListingFollowStatuses = (id, statuses) => async dispatch => {
  dispatch({
    id,
    tabName: 'FAVORITES',
    type: FETCH_CHANGE_LISTING_FOLLOW_REQUEST
  })

  try {
    const response = await api.changeListingFollowStatuses(id, statuses)

    dispatch({
      listing: response.body.data,
      tabName: 'FAVORITES',
      type: FETCH_CHANGE_LISTING_FOLLOW_SUCCESS
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
      tabName: 'FAVORITES',
      type: FETCH_CHANGE_LISTING_FOLLOW_FAILURE
    })
  }
}

export default changeListingFollowStatuses
