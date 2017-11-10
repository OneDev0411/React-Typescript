import {
  RESET_SEARCH_TYPE,
  SEARCH_BY_MAP_BOUNDS,
  SEARCH_BY_MLS_NUMBER,
  SEARCH_BY_POSTAL_CODE,
  SEARCH_BY_FILTERS_AREAS,
  SEARCH_BY_GOOGLE_SUGGESTS
} from '../../../constants/listings/search'

const type = (state = 'by_map_bounds', action) => {
  switch (action.type) {
    case RESET_SEARCH_TYPE:
    case SEARCH_BY_MAP_BOUNDS:
      return 'by_map_bounds'

    case SEARCH_BY_GOOGLE_SUGGESTS:
      return 'by_google_suggests'

    case SEARCH_BY_MLS_NUMBER:
      return 'by_mls_number'

    case SEARCH_BY_POSTAL_CODE:
      return 'by_postal_code'

    case SEARCH_BY_FILTERS_AREAS:
      return 'by_filters_areas'

    default:
      return state
  }
}

export default type
