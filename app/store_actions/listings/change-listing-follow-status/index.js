import { addNotification as notify } from 'reapop'
import { normalize } from 'normalizr'
import * as schema from '../../../models/listings/schema'

import api from '../../../models/listings/listing'
import {
  FETCH_CHANGE_LISTING_FOLLOW_REQUEST,
  FETCH_CHANGE_LISTING_FOLLOW_SUCCESS,
  FETCH_CHANGE_LISTING_FOLLOW_FAILURE
} from '../../../constants/listings/listing'
import { selectTabListing } from '../../../reducers/listings/shared'

const changeListingFollowStatuses = (id, statuses, tabName) => async (
  dispatch,
  getState
) => {
  const {
    [tabName]: { listings }
  } = getState()

  const oldListing = selectTabListing(listings, id)

  try {
    const normalizedListing = {
      ...normalize([{ ...oldListing, isFetching: true }], schema.listingsList)
    }

    dispatch({
      response: normalizedListing,
      tabName,
      type: FETCH_CHANGE_LISTING_FOLLOW_REQUEST
    })

    const response = await api.changeListingFollowStatuses(id, statuses)
    const newListing = {
      ...oldListing,
      ...response.body.data,
      isFetching: false
    }

    const normalizedResponse = {
      ...normalize([newListing], schema.listingsList)
    }

    console.log(response, newListing)

    dispatch({
      response: normalizedResponse,
      tabName,
      type: FETCH_CHANGE_LISTING_FOLLOW_SUCCESS
    })
  } catch ({ response, message }) {
    const ErrorMessage =
      (response && response.body.message) || message || 'Something went wrong.'

    const normalizedListing = {
      ...normalize([{ ...oldListing, isFetching: false }], schema.listingsList)
    }

    dispatch(
      notify({
        title: 'Server Error',
        message: ErrorMessage,
        status: 'error'
      })
    )
    dispatch({
      response: normalizedListing,
      tabName,
      type: FETCH_CHANGE_LISTING_FOLLOW_FAILURE
    })
  }
}

export default changeListingFollowStatuses
