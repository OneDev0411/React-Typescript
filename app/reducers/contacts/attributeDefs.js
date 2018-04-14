import * as actionTypes from '../../constants/contacts'

export const attributeDefs = (state = [], action) => {
  switch (action.type) {
    case actionTypes.FETCH_CONTACT_ATTR_DEFS_SUCCESS:
      return action.definitions

    default:
      return state
  }
}
