import { DEALS_STATUSES } from '../../constants'
import { TDealsStatusList } from '../../types'

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
  const statusQueries = queryParam.split(',')

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
