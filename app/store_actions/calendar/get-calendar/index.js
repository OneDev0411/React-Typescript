import * as actionTypes from 'constants/calendar'

// import fetchCalendar from 'models/calendar/get-calendar'

import { normalizeByDays } from '../normalize-calendar'

export function getCalendar(fromUnix, toUnix, filter = []) {
  return async dispatch => {
    try {
      dispatch({
        type: actionTypes.CALENDAR__FETCH_REQUEST
      })

      const list = await fetchCalendar(fromUnix, toUnix, filter)
      const normalizedByDays = normalizeByDays(fromUnix, toUnix, list)

      const listByIds = {}

      list.forEach(item => (listByIds[item.id] = item))

      dispatch({
        type: actionTypes.CALENDAR__FETCH_SUCCESS,
        list: listByIds,
        byDay: normalizedByDays
      })
    } catch (e) {
      console.log(e)

      dispatch({
        type: actionTypes.CALENDAR__FETCH_FAIL
      })

      throw e
    }
  }
}
