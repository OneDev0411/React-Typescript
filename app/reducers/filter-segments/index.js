import * as types from '../../constants/filter-segments'
import _ from 'underscore'

const initialState = {
  list: {},
  isFetching: false,
  isFetched: false,
  activeSegmentId: 'default',
  fetchError: null
}

export const getDefaultList = name => ({
  id: 'default',
  editable: false,
  name: `All ${name}`,
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
        isFetched: true,
        list: action.list
      }

    case types.FETCH_FILTER_SEGMENTS_FAILURE:
      return {
        ...state,
        fetchError: action.error,
        isFetching: false
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

export const selectActiveSavedSegment = (state, listName = '') =>
  (state.list && state.list[state.activeSegmentId]) || getDefaultList(listName)

export const getSegments = (state, listName) =>
  [].concat([getDefaultList(listName)], Object.values(state.list))

export const selectSavedSegmentById = (state, id) =>
  state.list && state.list[id]
