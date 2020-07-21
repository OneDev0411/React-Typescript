import _ from 'underscore'

import * as types from '../../constants/filter-segments'

const initialState: IReduxFilterSegmentState = {
  list: null,
  isFetching: false,
  conditionOperator: 'and',
  activeSegmentId: 'default',
  fetchError: null,
  activeFilters: {}
}

export const getDefaultList: (name: string) => ISavedSegment = (name = '') => ({
  id: 'default',
  is_editable: false,
  name: `All ${name.charAt(0).toUpperCase()}${name.slice(1)}`,
  filters: []
})

const filterSegments = <T>(state: IReduxFilterSegmentState<T>, action) => {
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

    case types.CREATE_ACTIVE_FILTERS: {
      let activeFilters = {}
      let filterCounter = 0

      action.filters.forEach(filter => {
        activeFilters[filterCounter++] = filter
      })

      return {
        ...state,
        activeFilters
      }
    }

    case types.ADD_ACTIVE_FILTER:
      return {
        ...state,
        activeFilters: {
          ...state.activeFilters,
          [_.uniqueId(`${action.filterId}-`)]: {
            id: action.filterId,
            isActive: true
          }
        }
      }

    case types.TOGGLE_FILTER_ACTIVE: {
      const filter = state.activeFilters[action.filterId]

      return {
        ...state,
        activeFilters: {
          ...state.activeFilters,
          [action.filterId]: {
            ...filter,
            isActive: !filter.isActive
          }
        }
      }
    }

    case types.UPDATE_ACTIVE_FILTER: {
      const filter = state.activeFilters[action.filterId]

      return {
        ...state,
        activeFilters: {
          ...state.activeFilters,
          [action.filterId]: { ...filter, ...action.filterData }
        }
      }
    }

    case types.REMOVE_ACTIVE_FILTER:
      return {
        ...state,
        activeFilters: _.omit(
          state.activeFilters,
          (filter, id) => id === action.filterId
        )
      }

    case types.CHANGE_CONDITION_OPERATOR:
      return {
        ...state,
        conditionOperator: action.conditionOperator
      }

    case types.RESET_ACTIVE_FILTERS:
      return {
        ...state,
        activeFilters: {}
      }

    default:
      return state
  }
}

function createReducer<T>(id) {
  const createList = reducer => (
    state: IReduxFilterSegmentState<T> = initialState,
    action
  ) => {
    if (action && action.namespace === 'filter-segments' && action.id === id) {
      return reducer(state, action)
    }

    return state
  }

  return createList(filterSegments)
}

export const contactsFilterSegments = createReducer<IContactList>('contacts')
export const dealsFilterSegments = createReducer('deals')
export const mlsFilterSegments = createReducer('mls')

export const isFetchingSavedSegments = state => state.isFetching
export const savedSegmentId = state => state.activeSegmentId

export const areListsFetched = state => state.list !== null

export const selectActiveSavedSegment = <T = any>(
  state: IReduxFilterSegmentState,
  listName = '',
  predefinedLists: StringMap<T> = {}
) => {
  const activeSegmentId = state.activeSegmentId

  if (!state.list) {
    return predefinedLists[activeSegmentId || 'default']
  }

  return predefinedLists[activeSegmentId] || state.list[activeSegmentId]
}

export const getSegments = <T = any>(
  state: IReduxFilterSegmentState,
  listName: string,
  predefinedLists: StringMap<T> = {}
) =>
  ([] as T[]).concat(
    Object.values(predefinedLists),
    Object.values(state.list || {})
  )

export const selectSavedSegmentById = <T = any>(
  state: IReduxFilterSegmentState<T>,
  id
) => state.list && state.list[id]

export const selectActiveFilters = <T = any>(
  state: IReduxFilterSegmentState<T>
) => state.activeFilters
