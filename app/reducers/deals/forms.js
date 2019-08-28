import * as actionTypes from '../../constants/deals'

export default (state = {}, action) => {
  switch (action.type) {
    case actionTypes.GET_FORMS:
      return {
        ...state,
        [action.dealId]: action.forms
      }

    default:
      return state
  }
}

export const selectForms = (state, dealId) =>
  state && dealId ? state[dealId] : {}

export const selectFormById = (state, dealId, id) =>
  state && dealId && id && state[dealId] ? state[dealId][id] : null
