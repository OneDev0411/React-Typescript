import addDays from 'date-fns/addDays'

import { getUTCStartOfCurrentDayTimestamp } from '@app/utils/date-utils'

import { ClosingsFilterQuery } from '../types'

export function getClosingsFilterQuery(
  query: string,
  days: number = 14
): ClosingsFilterQuery {
  const fromDate = new Date(getUTCStartOfCurrentDayTimestamp())
  const toDate = addDays(fromDate, days)

  return {
    query,
    contexts: {
      closing_date: {
        date: {
          from: fromDate.toISOString(),
          to: toDate.toISOString()
        }
      }
    },
    status: {
      is_archived: false,
      is_null: true
    }
  }
}
