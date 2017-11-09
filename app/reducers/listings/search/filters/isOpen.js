import {
  HIDE_FILTERS_AREA,
  SHOW_FILTERS_AREA,
  TOGGLE_FILTERS_AREA
} from '../../../../constants/listings/search/filters'

const isOpen = (state = false, action) => {
  switch (action.type) {
    case SHOW_FILTERS_AREA:
      return true
    case HIDE_FILTERS_AREA:
      return false
    case TOGGLE_FILTERS_AREA:
      return !state
    default:
      return state
  }
}

export default isOpen
