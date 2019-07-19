import * as actionTypes from '../../constants/deals'

export default (state = {}, action) => {
  switch (action.type) {
    case actionTypes.GET_FORMS:
      return {
        ...state,
        [action.brandId]: action.forms
      }

    default:
      return state
  }
}

export const selectFormsByBrand = (state, brand) =>
  state && brand ? state[brand] : {}

export const selectFormById = (state, brand, id) =>
  state && brand && id && state[brand] ? state[brand][id] : null
