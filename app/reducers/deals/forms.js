import * as actionTypes from '../../constants/deals'

export default (state = null, action) => {
  switch (action.type) {
    case actionTypes.GET_FORMS:
      return action.forms

    default:
      return state
  }
}

export const selectFormById = (state, id) => (state && id ? state[id] : null)
