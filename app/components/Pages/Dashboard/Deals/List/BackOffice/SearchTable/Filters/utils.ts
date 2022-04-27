import { isValid, parseISO } from 'date-fns'

import { DEALS_STATUSES } from '../../constants'
import { DealsListContext, TDealsStatusList } from '../../types'

const zeroFill = (i: number) => {
  return (i < 10 ? '0' : '') + i
}

// Convert status filter query string to status object
export const parseStatusFilterString = (
  statusQueries: string[]
): TDealsStatusList => {
  const statusKeys = Object.keys(DEALS_STATUSES)

  const statusList: TDealsStatusList = {}

  statusKeys.forEach(key => {
    if (statusQueries.includes(key)) {
      statusList[key] = true
    } else {
      statusList[key] = false
    }
  })

  return statusList
}

// Convert Range Date filter to Array of string
export const arrayifyRangeDateFilter = (
  filters?: DealsListContext
): [string, string] | [] => {
  if (filters && filters.date && (filters.date.from || filters.date.to)) {
    return [filters.date.from || 'any', filters.date.to || 'any']
  }

  return []
}

// Convert Range Date filter query string to Range date object
export const parseRangeDateFilterString = (
  dateQueries: [string, string] | []
): DealsListContext => {
  const from: string | undefined =
    dateQueries.length && isValid(parseISO(dateQueries[0]))
      ? (dateQueries[0] as string)
      : undefined

  const to: string | undefined =
    dateQueries.length && isValid(parseISO(dateQueries[1]))
      ? (dateQueries[1] as string)
      : undefined

  return { date: { from, to } }
}

// Convert locat date to first moment of the day in UTC format
export const getUtcFirstMomentOfDay = (date: Date) => {
  return `${date.getFullYear()}-${zeroFill(date.getMonth() + 1)}-${zeroFill(
    date.getDate()
  )}T00:00:00Z`
}

// Convert locat date to last moment of the day in UTC format
export const getUtcLastMomentOfDay = (date: Date) => {
  return `${date.getFullYear()}-${zeroFill(date.getMonth() + 1)}-${zeroFill(
    date.getDate()
  )}T23:59:59Z`
}

// Convert utc date to js date
export const utcToDate = (utc: string) => {
  const year = Number(utc.substring(0, 4))
  const month = Number(utc.substring(5, 7)) - 1
  const day = Number(utc.substring(8, 10))

  return new Date(year, month, day)
}
