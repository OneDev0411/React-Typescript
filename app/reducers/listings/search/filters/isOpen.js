import { TOGGLE_FILTERS_AREA } from '../../../../constants/listings/search/filters'

const isOpen = (state = false, action) => {
  switch (action.type) {
    case TOGGLE_FILTERS_AREA:
      return !state
    default:
      return state
  }
}

export default isOpen
