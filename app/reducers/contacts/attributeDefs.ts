import _ from 'underscore'
import { combineReducers } from 'redux'

import * as actionTypes from '../../constants/contacts'

interface IByIdState {
  [attributeId: string]: IContactAttributeDef
}

interface IByNameState {
  [attributeName: string]: UUID
}

interface IBySectionState {
  [sectionName: string]: UUID[]
}

export interface IAttributeDefsState {
  byId: IByIdState
  byName: IByNameState
  bySection: IBySectionState
}

function byId(state: IByIdState = {}, action): IByIdState {
  switch (action.type) {
    case actionTypes.FETCH_CONTACT_ATTR_DEFS_SUCCESS:
    case actionTypes.CREATE_CONTACT_ATTR_DEF_SUCCESS:
      return _.indexBy(action.definitions, 'id')

    default:
      return state
  }
}

function byName(state: IByNameState = {}, action): IByNameState {
  switch (action.type) {
    case actionTypes.FETCH_CONTACT_ATTR_DEFS_SUCCESS:
      const names = {}

      action.definitions.forEach(def => {
        if (def.name) {
          names[def.name] = def.id
        }
      })

      return names

    default:
      return state
  }
}

function bySection(
  state: IBySectionState = {},
  action: {
    definitions: IContactAttributeDef[]
    type: keyof typeof actionTypes
  }
): IBySectionState {
  switch (action.type) {
    case actionTypes.FETCH_CONTACT_ATTR_DEFS_SUCCESS:
    case actionTypes.CREATE_CONTACT_ATTR_DEF_SUCCESS:
      const groupBySection = _.groupBy<IContactAttributeDef[]>(
        action.definitions,
        'section'
      )

      const result = {}

      _.each(groupBySection, (definitions, section) => {
        result[section] = definitions.map(def => def.id)
      })

      return result
    default:
      return state
  }
}

export const attributeDefs = combineReducers<IAttributeDefsState>({
  byId,
  byName,
  bySection
})

export function selectDefinition(state, id) {
  return state.byId[id] || null
}

export function selectDefinitions(state) {
  return Object.values(state.byId)
}

export function selectDefinitionByName(state: IAttributeDefsState, name) {
  const id = state.byName[name]

  return id ? state.byId[id] : null
}

export function selectDefsBySection(state, section) {
  const ids = state.bySection[section]

  return Array.isArray(ids)
    ? ids.map(id => selectDefinition(state, id)).filter(i => i)
    : []
}

export function isLoadedContactAttrDefs(state) {
  return Object.keys(state.byId).length > 0
}
