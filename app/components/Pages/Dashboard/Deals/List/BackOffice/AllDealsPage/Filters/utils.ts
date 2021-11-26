import { isValid, parseISO } from 'date-fns'

import {
  DEALS_STATUSES,
  QUERY_ARRAY_PARAM_SPLITTER_CHAR
} from '../../constants'
import { DealsListContext, TDealsStatusList } from '../../types'

// Convert status filter to query string
export const stringifyStatusFilter = (filters: TDealsStatusList): string => {
  const statusKeys = Object.keys(DEALS_STATUSES)
  const values = statusKeys.map(key => `${+!!filters[key]}${key}`)

  return values.join(',')
}

// Convert status filter query string to status object
export const parseStatusFilterString = (
  queryParam: string
): TDealsStatusList => {
  const statusKeys = Object.keys(DEALS_STATUSES)
  const statusQueries = queryParam.split(QUERY_ARRAY_PARAM_SPLITTER_CHAR)

  const statusList: TDealsStatusList = {}

  statusQueries.forEach(statusQuery => {
    const key = statusQuery.slice(1)
    const value = !!statusQuery.slice(0, 1)

    if (statusKeys.includes(key)) {
      statusList[key] = value
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
