import { SET_SEARCH_INPUT } from '../../../constants/listings/search'

const input = (state = '', action) => {
  switch (action.type) {
    case SET_SEARCH_INPUT:
      return action.input
    default:
      return state
  }
}

export default input
