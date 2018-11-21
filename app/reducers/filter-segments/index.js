import _ from 'underscore'

import * as types from '../../constants/filter-segments'

const initialState = {
  list: null,
  isFetching: false,
  activeSegmentId: 'default',
  fetchError: null
}

export const getDefaultList = (name = '') => ({
  id: 'default',
  editable: false,
  name: `All ${name.charAt(0).toUpperCase()}${name.slice(1)}`,
  filters: []
})

const filterSegments = (state, action) => {
  switch (action.type) {
    case types.CHANGE_ACTIVE_FILTER_SEGMENT:
      return {
        ...state,
        activeSegmentId: action.segmentId
      }

    case types.FETCH_FILTER_SEGMENTS:
      return {
        ...state,
        isFetching: true
      }

    case types.FETCH_FILTER_SEGMENTS_SUCCESS:
      return {
        ...state,
        isFetching: false,
        list: action.list
      }

    case types.FETCH_FILTER_SEGMENTS_FAILURE:
      return {
        ...state,
        fetchError: action.error
      }

    case types.SAVE_FILTER_SEGMENTS:
      return {
        ...state,
        isSaving: false,
        list: {
          ...state.list,
          [action.list.id]: action.list
        }
      }

    case types.DELETE_FILTER_SEGMENTS:
      return {
        ...state,
        list: _.omit(state.list, item => item.id === action.segmentId)
      }

    default:
      return state
  }
}

function createReducer(id) {
  const createList = reducer => (state = initialState, action) => {
    if (action && action.namespace === 'filter-segments' && action.id === id) {
      return reducer(state, action)
    }

    return state
  }

  return createList(filterSegments)
}

export const contactsFilterSegments = createReducer('contacts')
export const dealsFilterSegments = createReducer('deals')
export const mlsFilterSegments = createReducer('mls')

export const isFetchingSavedSegments = state => state.isFetching
export const savedSegmentId = state => state.activeSegmentId

export const isListFetched = state => state.list !== null

export const selectActiveSavedSegment = (state, listName = '') =>
  !state.list || state.activeSegmentId === 'default'
    ? getDefaultList(listName)
    : state.list[state.activeSegmentId]

export const getSegments = (state, listName) =>
  [].concat([getDefaultList(listName)], Object.values(state.list || {}))

export const selectSavedSegmentById = (state, id) =>
  state.list && state.list[id]
