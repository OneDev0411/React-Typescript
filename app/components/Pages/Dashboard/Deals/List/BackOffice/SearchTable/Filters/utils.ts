import { isValid, parseISO } from 'date-fns'

import {
  DEALS_STATUSES,
  QUERY_ARRAY_PARAM_SPLITTER_CHAR
} from '../../constants'
import {
  DealsListContext,
  DealsListFilters,
  TDealsStatusList
} from '../../types'

// Convert status filter to query string
export const stringifyStatusFilter = (filters: TDealsStatusList): string => {
  const statusKeys = Object.keys(DEALS_STATUSES)
  const values = statusKeys.filter(key => !!filters[key]).map(key => key)

  return values.join(QUERY_ARRAY_PARAM_SPLITTER_CHAR)
}

// Convert status filter query string to status object
export const parseStatusFilterString = (
  queryParam: string
): TDealsStatusList => {
  const statusKeys = Object.keys(DEALS_STATUSES)
  const statusQueries = queryParam.split(QUERY_ARRAY_PARAM_SPLITTER_CHAR)

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

// Convert Range Date filter to query string
export const stringifyRangeDateFilter = (filters: DealsListContext): string => {
  if (filters.date && (filters.date.from || filters.date.to)) {
    return `${filters.date.from ?? ''}${QUERY_ARRAY_PARAM_SPLITTER_CHAR}${
      filters.date.to ?? ''
    }`
  }

  return ''
}

// Convert Range Date filter query string to Range date object
export const parseRangeDateFilterString = (
  queryParam: string
): DealsListContext => {
  const dateQueries = queryParam.split(QUERY_ARRAY_PARAM_SPLITTER_CHAR)

  const from: string | undefined = isValid(parseISO(dateQueries[0]))
    ? (dateQueries[0] as string)
    : undefined

  const to: string | undefined = isValid(parseISO(dateQueries[1]))
    ? (dateQueries[1] as string)
    : undefined

  return { date: { from, to } }
}

export const adjustForUTCOffset = (date: Date) => {
  return new Date(
    date.getUTCFullYear(),
    date.getUTCMonth(),
    date.getUTCDate(),
    date.getUTCHours(),
    date.getUTCMinutes(),
    date.getUTCSeconds()
  )
}

const zeroFill = (i: number) => {
  return (i < 10 ? '0' : '') + i
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

export function isStatusFilterChanged(
  defaults: DealsListFilters,
  current: DealsListFilters
) {
  return (
    !!current.status.is_active !== !!defaults.status.is_active ||
    !!current.status.is_archived !== !!defaults.status.is_archived ||
    !!current.status.is_closed !== !!defaults.status.is_closed ||
    !!current.status.is_null !== !!defaults.status.is_null ||
    !!current.status.is_pending !== !!defaults.status.is_pending
  )
}
