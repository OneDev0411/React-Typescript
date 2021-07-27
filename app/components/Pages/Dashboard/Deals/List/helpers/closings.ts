import addDays from 'date-fns/addDays'
import startOfDay from 'date-fns/startOfDay'

import { ClosingDateRange, ClosingsFilterQuery } from '../types'

export function getClosingDateRange(days: number = 14): ClosingDateRange {
  return {
    from: new Date().getTime() / 1000,
    to: addDays(new Date(), days).getTime() / 1000
  }
}

export function getClosingsFilterQuery(
  query: string,
  days: number = 14
): ClosingsFilterQuery {
  const today = startOfDay(new Date())

  return {
    query,
    contexts: {
      closing_date: {
        date: {
          from: today.toISOString(),
          to: addDays(today, days).toISOString()
        }
      }
    },
    status: {
      is_archived: false
    }
  }
}
