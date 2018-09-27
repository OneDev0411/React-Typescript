import * as actionTypes from '../../../constants/calendar'

export function setCalendarFilter(filter) {
  return {
    type: actionTypes.CALENDAR__SET_FILTER,
    filter
  }
}
