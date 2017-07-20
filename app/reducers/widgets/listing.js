import { combineReducers } from 'redux'
import { isFetching, errorMessage } from '../listings/shared'
import { FETCH_WIDGET_LISTING_SUCCESS } from '../../constants/widgets/listing'

const data = (state = {}, action) => {
  switch (action.type) {
    case FETCH_WIDGET_LISTING_SUCCESS:
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