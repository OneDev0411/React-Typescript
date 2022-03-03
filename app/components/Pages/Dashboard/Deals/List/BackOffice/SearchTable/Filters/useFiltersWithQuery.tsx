import { Dispatch, SetStateAction, useEffect, useState } from 'react'

import { isEqual } from 'lodash'

import { useReplaceAutoQueryParam } from '@app/hooks/use-query-param'

import {
  DEALS_LIST_DEFAULT_FILTERS,
  QUERY_ARRAY_PARAM_SPLITTER_CHAR
} from '../../constants'
import { DealsListFilters } from '../../types'

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
    useReplaceAutoQueryParam('dealType')
  const [propertyTypeParamValue, setPropertyTypeParamValue] =
    useReplaceAutoQueryParam('propertyType')
  const [statusParamValue, setStatusParamValue] =
    useReplaceAutoQueryParam('status')
  const [closingDateParamValue, setClosingDateParamValue] =
    useReplaceAutoQueryParam('closingDate')
  const [listDateParamValue, setListDateParamValue] =
    useReplaceAutoQueryParam('listDate')
  const [expirationDateParamValue, setExpirationDateParamValue] =
    useReplaceAutoQueryParam('expirationDate')
  const [contractDateParamValue, setContractDateParamValue] =
    useReplaceAutoQueryParam('contractDate')
  const [leaseBeginParamValue, setLeaseBeginParamValue] =
    useReplaceAutoQueryParam('leaseBegin')
  const [leaseEndParamValue, setLeaseEndParamValue] =
    useReplaceAutoQueryParam('leaseEnd')

  const [userFilters, setUserFilters] = useState<DealsListFilters>({
    ...DEALS_LIST_DEFAULT_FILTERS,
    ...(dealTypeParamValue
      ? {
          deal_type: dealTypeParamValue.split(
            QUERY_ARRAY_PARAM_SPLITTER_CHAR
          ) as IDealType[]
        }
      : {}),
    ...(propertyTypeParamValue
      ? {
          property_type: propertyTypeParamValue.split(
            QUERY_ARRAY_PARAM_SPLITTER_CHAR
          ) as UUID[]
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
      ...(expirationDateParamValue
        ? {
            expiration_date: parseRangeDateFilterString(
              expirationDateParamValue
            )
          }
        : {}),
      ...(contractDateParamValue
        ? {
            contract_date: parseRangeDateFilterString(contractDateParamValue)
          }
        : {}),
      ...(leaseBeginParamValue
        ? {
            lease_begin: parseRangeDateFilterString(leaseBeginParamValue)
          }
        : {}),
      ...(leaseEndParamValue
        ? {
            lease_end: parseRangeDateFilterString(leaseEndParamValue)
          }
        : {})
    }
  })

  // Set query params after each change
  useEffect(() => {
    setDealTypeParamValue(
      userFilters.deal_type &&
        !isEqual(userFilters.deal_type, DEALS_LIST_DEFAULT_FILTERS.deal_type)
        ? userFilters.deal_type.join(QUERY_ARRAY_PARAM_SPLITTER_CHAR)
        : ''
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userFilters.deal_type])

  useEffect(() => {
    console.log('property_type changed', userFilters.property_type)
    setPropertyTypeParamValue(
      userFilters.property_type && userFilters.property_type.length
        ? userFilters.property_type.join(QUERY_ARRAY_PARAM_SPLITTER_CHAR)
        : ''
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userFilters.property_type])

  useEffect(() => {
    setStatusParamValue(
      !isEqual(userFilters.status, DEALS_LIST_DEFAULT_FILTERS.status)
        ? stringifyStatusFilter(userFilters.status)
        : ''
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userFilters.status])

  useEffect(() => {
    setClosingDateParamValue(
      userFilters.contexts.closing_date?.date
        ? stringifyRangeDateFilter(userFilters.contexts.closing_date)
        : ''
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userFilters.contexts.closing_date])

  useEffect(() => {
    setListDateParamValue(
      userFilters.contexts.list_date?.date
        ? stringifyRangeDateFilter(userFilters.contexts.list_date)
        : ''
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userFilters.contexts.list_date])

  useEffect(() => {
    setExpirationDateParamValue(
      userFilters.contexts.expiration_date?.date
        ? stringifyRangeDateFilter(userFilters.contexts.expiration_date)
        : ''
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userFilters.contexts.expiration_date])

  useEffect(() => {
    setContractDateParamValue(
      userFilters.contexts.contract_date?.date
        ? stringifyRangeDateFilter(userFilters.contexts.contract_date)
        : ''
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userFilters.contexts.contract_date])

  useEffect(() => {
    setLeaseBeginParamValue(
      userFilters.contexts.lease_begin?.date
        ? stringifyRangeDateFilter(userFilters.contexts.lease_begin)
        : ''
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userFilters.contexts.lease_begin])

  useEffect(() => {
    setLeaseEndParamValue(
      userFilters.contexts.lease_end?.date
        ? stringifyRangeDateFilter(userFilters.contexts.lease_end)
        : ''
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userFilters.contexts.lease_end])

  return [userFilters, setUserFilters]
}
