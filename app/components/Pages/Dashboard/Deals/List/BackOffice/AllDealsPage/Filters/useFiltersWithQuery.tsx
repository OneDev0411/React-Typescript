import { Dispatch, SetStateAction, useEffect, useState } from 'react'

import { useReplaceQueryParam } from '@app/hooks/use-query-param'

import {
  DEALS_LIST_DEFAULT_FILTERS,
  QUERY_ARRAY_PARAM_SPLITTER_CHAR
} from '../../constants'
import { DealsListFilters } from '../../types'

import { isStatusFilterChanged } from './statusEditor/button'
import {
  parseStatusFilterString,
  parseRangeDateFilterString,
  stringifyRangeDateFilter,
  stringifyStatusFilter
} from './utils'

export const UseFiltersWithQuery = (): [
  DealsListFilters,
  Dispatch<SetStateAction<DealsListFilters>>
] => {
  const [dealTypeParamValue, setDealTypeParamValue] =
    useReplaceQueryParam('dealType')
  const [statusParamValue, setStatusParamValue, removeStatusParamValue] =
    useReplaceQueryParam('status')
  const [
    closingDateParamValue,
    setClosingDateParamValue,
    removeClosingDateParamValue
  ] = useReplaceQueryParam('closingDate')
  const [listDateParamValue, setListDateParamValue, removeListDateParamValue] =
    useReplaceQueryParam('listDate')
  const [
    listExpirationParamValue,
    setListExpirationParamValue,
    removeListExpirationParamValue
  ] = useReplaceQueryParam('listExpiration')

  const [userFilters, setUserFilters] = useState<DealsListFilters>({
    ...DEALS_LIST_DEFAULT_FILTERS,
    ...(dealTypeParamValue
      ? {
          deal_type: dealTypeParamValue.split(
            QUERY_ARRAY_PARAM_SPLITTER_CHAR
          ) as IDealType[]
        }
      : {}),
    status: {
      ...DEALS_LIST_DEFAULT_FILTERS.status,
      ...(statusParamValue ? parseStatusFilterString(statusParamValue) : {})
    },
    contexts: {
      ...DEALS_LIST_DEFAULT_FILTERS.contexts,
      ...(closingDateParamValue
        ? { closing_date: parseRangeDateFilterString(closingDateParamValue) }
        : {}),
      ...(listDateParamValue
        ? { list_date: parseRangeDateFilterString(listDateParamValue) }
        : {}),
      ...(listExpirationParamValue
        ? {
            list_expiration: parseRangeDateFilterString(
              listExpirationParamValue
            )
          }
        : {})
    }
  })

  // Set query params after each change
  useEffect(() => {
    if (userFilters.deal_type) {
      setDealTypeParamValue(
        userFilters.deal_type.join(QUERY_ARRAY_PARAM_SPLITTER_CHAR)
      )
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userFilters.deal_type])

  useEffect(() => {
    if (isStatusFilterChanged(DEALS_LIST_DEFAULT_FILTERS, userFilters)) {
      setStatusParamValue(stringifyStatusFilter(userFilters.status))
    } else {
      removeStatusParamValue()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userFilters.status])

  useEffect(() => {
    if (userFilters.contexts.closing_date?.date) {
      setClosingDateParamValue(
        stringifyRangeDateFilter(userFilters.contexts.closing_date)
      )
    } else {
      removeClosingDateParamValue()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userFilters.contexts.closing_date])

  useEffect(() => {
    if (userFilters.contexts.list_date?.date) {
      setListDateParamValue(
        stringifyRangeDateFilter(userFilters.contexts.list_date)
      )
    } else {
      removeListDateParamValue()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userFilters.contexts.list_date])

  useEffect(() => {
    if (userFilters.contexts.list_expiration?.date) {
      setListExpirationParamValue(
        stringifyRangeDateFilter(userFilters.contexts.list_expiration)
      )
    } else {
      removeListExpirationParamValue()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userFilters.contexts.list_expiration])

  return [userFilters, setUserFilters]
}
