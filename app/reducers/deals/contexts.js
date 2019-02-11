import * as actionTypes from '../../constants/deals'

export default (state = {}, action) => {
  switch (action.type) {
    case actionTypes.GET_CONTEXTS:
      return {
        ...state,
        [action.brandId]: action.contexts
      }

    default:
      return state
  }
}

export const selectContexts = (state, brandId) => state[brandId]
