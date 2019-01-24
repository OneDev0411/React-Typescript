import * as actionTypes from '../../../constants/filter-segments'

export function createActiveFilters(nameId, filters) {
  return {
    type: actionTypes.CREATE_ACTIVE_FILTERS,
    filters,
    namespace: 'filter-segments',
    id: nameId
  }
}

export function addActiveFilter(nameId, filterId) {
  return {
    type: actionTypes.ADD_ACTIVE_FILTER,
    filterId,
    namespace: 'filter-segments',
    id: nameId
  }
}

export function toggleActiveFilter(nameId, filterId) {
  return {
    type: actionTypes.TOGGLE_FILTER_ACTIVE,
    filterId,
    namespace: 'filter-segments',
    id: nameId
  }
}

export function updateActiveFilter(nameId, filterId, filterData) {
  return {
    type: actionTypes.UPDATE_ACTIVE_FILTER,
    filterData,
    namespace: 'filter-segments',
    id: nameId,
    filterId
  }
}

export function removeActiveFilter(nameId, filterId) {
  return {
    type: actionTypes.REMOVE_ACTIVE_FILTER,
    filterId,
    namespace: 'filter-segments',
    id: nameId
  }
}

export function changeConditionOperator(nameId, conditionOperator) {
  return {
    type: actionTypes.CHANGE_CONDITION_OPERATOR,
    namespace: 'filter-segments',
    id: nameId,
    conditionOperator
  }
}

export function createActiveFiltersWithConditionOperator(
  nameId,
  filters,
  conditionOperator
) {
  return async dispatch =>
    Promise.all([
      dispatch(changeConditionOperator(nameId, conditionOperator)),
      dispatch(createActiveFilters(nameId, filters))
    ])
}
