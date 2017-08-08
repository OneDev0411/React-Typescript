import { combineReducers } from 'redux'
import { isFetching, errorMessage } from '../shared'
import { FETCH_LISTING_SUCCESS } from '../../../constants/listings/listing'

const data = (state = {}, action) => {
  switch (action.type) {
    case FETCH_LISTING_SUCCESS:
      return {
        ...state,
        ...action.response
      }
    default:
      return state
  }
}

const listing = combineReducers({
  data,
  isFetching,
  errorMessage
})

export default listing
