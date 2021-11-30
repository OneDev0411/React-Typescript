import { queryOptions } from '../../../components/Pages/Dashboard/MLS/constants'
import { SET_SEARCH_LISTINGS_OPTIONS } from '../../../constants/listings/search'

const options = (state = queryOptions, action) => {
  switch (action.type) {
    case SET_SEARCH_LISTINGS_OPTIONS:
      return {
        ...state,
        ...action.options
      }
    default:
      return state
  }
}

export default options
