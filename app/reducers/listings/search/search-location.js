import { SET_SEARCH_LOCATION } from '../../../constants/listings/search'

export function location(state = null, action) {
  switch (action.type) {
    case SET_SEARCH_LOCATION:
      return action.center
    default:
      return state
  }
}
