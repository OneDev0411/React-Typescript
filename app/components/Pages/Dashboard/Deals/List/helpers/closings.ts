import addDays from 'date-fns/addDays'
import startOfDay from 'date-fns/startOfDay'

import { ClosingsFilterQuery } from '../types'

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
