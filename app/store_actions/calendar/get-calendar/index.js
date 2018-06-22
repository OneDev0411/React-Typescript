import _ from 'underscore'

import * as actionTypes from '../../../constants/calendar'
import { normalizeByDays } from '../normalize-calendar'
import { getCalendar as fetch } from '../../../models/Calendar'

export function getCalendar(fromUnix, toUnix) {
  return async dispatch => {
    try {
      dispatch({
        type: actionTypes.CALENDAR__FETCH_REQUEST
      })

      const list = await fetch(fromUnix, toUnix)
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

export const getCalendarById = (state, id) => state && state[id]
