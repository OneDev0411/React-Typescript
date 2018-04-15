import * as actionTypes from '../../constants/contacts'

export const attributeDefs = (state = [], action) => {
  switch (action.type) {
    case actionTypes.FETCH_CONTACT_ATTR_DEFS_SUCCESS:
      return action.definitions

    default:
      return state
  }
}

export function selectDefinition(state, name) {
  const def = state.filter(defs => defs.name === name)

  if (def.length > 0) {
    return def[0]
  }

  return null
}
