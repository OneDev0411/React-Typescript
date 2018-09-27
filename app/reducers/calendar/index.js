import moment from 'moment'
import _ from 'underscore'

import * as types from '../../constants/calendar'

const initialState = {
  isFetching: false,
  selectedDate: moment()
    .utcOffset(0)
    .toDate(),
  byDay: {},
  list: [],
  brandMembers: [],
  filter: []
}

function ksort(object) {
  return Object.entries(object)
    .sort()
    .reduce((o, [k, v]) => ((o[k] = v), o), {})
}

export const getStartRange = ({ byDay: days }) => {
  if (_.size(days) === 0) {
    return 0
  }

  const start = _.first(_.keys(days))

  return ~~moment(start)
    .utcOffset(0)
    .add(1, 'day')
    .startOf('day')
    .format('X')
}

export const getEndRange = ({ byDay: days }) => {
  if (_.size(days) === 0) {
    return 0
  }

  const end = _.last(_.keys(days))

  return ~~moment(end)
    .utcOffset(0)
    .add(1, 'day')
    .startOf('day')
    .format('X')
}

export default (state = initialState, action) => {
  switch (action.type) {
    case types.CALENDAR__FETCH_REQUEST:
      return {
        ...state,
        isFetching: true
      }

    case types.CALENDAR__FETCH_FAIL:
      return {
        ...state,
        isFetching: false
      }

    case types.CALENDAR__FETCH_SUCCESS:
      return {
        ...state,
        isFetching: false,
        list: {
          ...state.list,
          ...action.list
        },
        byDay: ksort({
          ...state.byDay,
          ...action.byDay
        })
      }

    case types.CALENDAR__SET_DATE:
      return {
        ...state,
        selectedDate: action.selectedDate
      }

    case types.CALENDAR__SET_BRAND_MEMBERS:
      return {
        ...state,
        brandMembers: action.brandMembers
      }

    case types.CALENDAR__SET_FILTER:
      return {
        ...state,
        filter: action.filter
      }

    case types.CALENDAR__RESET:
      return {
        ...initialState,
        brandMembers: state.brandMembers,
        filter: state.filter
      }

    default:
      return state
  }
}
