import * as actionTypes from '../../../constants/calendar'

export function setDate(selectedDate) {
  return {
    type: actionTypes.CALENDAR__SET_DATE,
    selectedDate
  }
}
