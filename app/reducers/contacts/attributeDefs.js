import _ from 'underscore'
import { combineReducers } from 'redux'

import * as actionTypes from '../../constants/contacts'

const byId = (state = {}, action) => {
  switch (action.type) {
    case actionTypes.FETCH_CONTACT_ATTR_DEFS_SUCCESS:
      return _.indexBy(action.definitions, 'id')

    default:
      return state
  }
}

const byName = (state = {}, action) => {
  switch (action.type) {
    case actionTypes.FETCH_CONTACT_ATTR_DEFS_SUCCESS:
      const names = {}

      action.definitions.forEach(def => {
        names[def.name] = def.id
      })

      return names

    default:
      return state
  }
}

export const attributeDefs = combineReducers({
  byId,
  byName
})

export function selectDefinition(state, id) {
  return state.byId[id] || null
}

export function selectDefinitionByName(state, name) {
  return state.byId[state.byName[name]] || null
}
