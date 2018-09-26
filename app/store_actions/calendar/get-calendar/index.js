import _ from 'underscore'

import * as actionTypes from '../../../constants/calendar'
import { normalizeByDays } from '../normalize-calendar'
import { getCalendar as fetchCalendar } from '../../../models/Calendar/get-calendar'

export function getCalendar(fromUnix, toUnix, filter = []) {
  return async dispatch => {
    try {
      dispatch({
        type: actionTypes.CALENDAR__FETCH_REQUEST
      })

      const list = await fetchCalendar(fromUnix, toUnix, filter)
      const normalizedByDays = normalizeByDays(fromUnix, toUnix, list)

      dispatch({
        type: actionTypes.CALENDAR__FETCH_SUCCESS,
        list: _.indexBy(list, 'id'),
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
