import * as actionTypes from '../../constants/deals'

export default (
  state = {
    byBrand: {},
    byDeal: {}
  },
  action
) => {
  switch (action.type) {
    case actionTypes.GET_BRAND_CONTEXTS:
      return {
        ...state,
        byBrand: {
          ...state.brandId,
          [action.brandId]: action.contexts
        }
      }

    case actionTypes.GET_DEAL_CONTEXTS:
      return {
        ...state,
        byDeal: {
          ...state.dealId,
          [action.dealId]: action.contexts
        }
      }

    default:
      return state
  }
}

export const selectContextsByBrand = (state, brandId) => state.byBrand[brandId]
export const selectContextsByDeal = (state, dealId) => state.byDeal[dealId]
export const selectExactContextsByBrand = (state, brandId) => {
  return state.byBrand[brandId]
    ? state.byBrand[brandId].filter(context => context.brand === brandId)
    : []
}
