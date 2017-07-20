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

export default type
