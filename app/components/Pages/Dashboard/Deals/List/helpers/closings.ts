import { addDays } from 'date-fns'

import { ClosingFromAndToDates } from '../types'

export function getClosingFromAndToDates(
  days: number = 14
): ClosingFromAndToDates {
  return {
    from: new Date().getTime() / 1000,
    to: addDays(new Date(), days).getTime() / 1000
  }
}

export function getClosingsFilterQuery(query: string, days: number = 14) {
  return {
    query,
    contexts: {
      closing_date: {
        date: {
          from: new Date().toISOString(),
          to: addDays(new Date(), days).toISOString()
        }
      }
    }
  }
}
