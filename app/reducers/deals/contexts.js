import * as actionTypes from '../../constants/deals'

export default (state = {}, action) => {
  switch (action.type) {
    case actionTypes.GET_BRAND_CONTEXTS:
      return {
        ...state.brandId,
        [action.brandId]: action.contexts
      }

    default:
      return state
  }
}

export const selectBrandContexts = (state, brandId) => state[brandId]
