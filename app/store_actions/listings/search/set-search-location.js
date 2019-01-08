import { SET_SEARCH_LOCATION } from '../../../constants/listings/search'

export function setSearchLocation(center) {
  return {
    center,
    type: SET_SEARCH_LOCATION
  }
}
