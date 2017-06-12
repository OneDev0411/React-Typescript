import { combineReducers } from 'redux'
import map from '../map'
import listings from '../index.js'
import { createNamedWrapperReducer } from '../../../utils/redux-utils'
import {
  RESET_SEARCH_TYPE,
  SEARCH_BY_MAP_BOUNDS,
  SEARCH_BY_MLS_NUMBER,
  SEARCH_BY_POSTAL_CODE
} from '../../../constants/listings/search'


const type = (state = 'by_map_bounds', action) => {
  switch (action.type) {
    case RESET_SEARCH_TYPE:
    case SEARCH_BY_MAP_BOUNDS:
      return 'by_map_bounds'

    case SEARCH_BY_MLS_NUMBER:
      return 'by_mls_number'

    case SEARCH_BY_POSTAL_CODE:
      return 'by_postal_code'

    default:
      return state
  }
}

const search = combineReducers({
  type,
  map: createNamedWrapperReducer(map, 'SEARCH'),
  listings: createNamedWrapperReducer(listings, 'SEARCH')
})

export default search
