import { useState, useEffect, useCallback } from 'react'

import { useUnsafeActiveBrandId } from '@app/hooks/brand/use-unsafe-active-brand-id'
import {
  getDealsListings,
  GetDealsListingOptions,
  GetDealsListingFilters
} from '@app/models/listings/listing/get-deals-listings'
import {
  getBrandListings,
  GetBrandListingsOptions,
  GetBrandListingsFilters
} from '@app/models/listings/search/get-brand-listings'
import { byValert as getBrandListingsCount } from '@app/models/listings/search/get-listings-count'

import { useDeepMemo } from './use-deep-memo'

interface UseBrandListingCountProperties {
  filters?: Exclude<GetBrandListingsFilters, 'brand'>
  isEnabled?: boolean
}

export function useBrandListingsCount({
  filters: filterParameters,
  isEnabled
}: UseBrandListingCountProperties): number {
  const activeBrandId = useUnsafeActiveBrandId()
  const [count, setCount] = useState<number>(0)
  const filters = useDeepMemo(
    () => ({
      brand: activeBrandId as UUID,
      ...filterParameters
    }),
    [activeBrandId, filterParameters]
  )

  const fetchBrandListingsCount = useCallback(async () => {
    try {
      const brandListingsCount = await getBrandListingsCount(filters)

      setCount(brandListingsCount)
    } catch (error) {
      console.error('error fetching brand listings count', error)
    }
  }, [filters])

  useEffect(() => {
    if (activeBrandId && isEnabled) {
      fetchBrandListingsCount()
    }
  }, [activeBrandId, fetchBrandListingsCount, isEnabled])

  return count
}

interface UseBrandListingProperties {
  filters?: Exclude<GetBrandListingsFilters, 'brand'>
  options?: GetBrandListingsOptions
}

export function useBrandListings({
  filters: filterParameters,
  options: optionParameters
}: UseBrandListingProperties = {}): Nullable<ICompactListing[]> {
  const activeBrandId = useUnsafeActiveBrandId()
  const [listings, setListings] = useState<Nullable<ICompactListing[]>>(null)
  const options = useDeepMemo(
    () => ({ ...optionParameters }),
    [optionParameters]
  )
  const filters = useDeepMemo(
    () => ({
      brand: activeBrandId as UUID,
      ...filterParameters
    }),
    [activeBrandId, filterParameters]
  )
  const fetchBrandListings = useCallback(async () => {
    try {
      setListings(null)

      const brandListings = await getBrandListings({
        options,
        filters
      })

      setListings(brandListings)
    } catch (error) {
      console.error('error fetching brand listings', error)
      setListings([])
    }
  }, [options, filters])

  useEffect(() => {
    if (activeBrandId) {
      fetchBrandListings()
    }
  }, [activeBrandId, fetchBrandListings])

  return listings
}

interface UseDealListingFilters extends Omit<GetDealsListingFilters, 'brand'> {
  listingIdsToExclude?: UUID[]
}

interface UseDealListingProperties {
  filters?: UseDealListingFilters
  options?: GetDealsListingOptions
}

export function useDealsListings({
  filters: { listingIdsToExclude, ...filterParameters } = {},
  options: optionParameters
}: UseDealListingProperties): {
  count: number
  listings: Nullable<IListing[]>
} {
  const activeBrandId = useUnsafeActiveBrandId()
  const [listings, setListings] = useState<Nullable<IListing[]>>(null)
  const [count, setCount] = useState<number>(0)
  const options = useDeepMemo(
    () => ({ ...optionParameters }),
    [optionParameters]
  )
  const filters = useDeepMemo(
    () => ({ brand: activeBrandId as UUID, ...filterParameters }),
    [activeBrandId, filterParameters]
  )

  const fetchDealsWithListings = useCallback(async () => {
    try {
      setListings(null)

      const { count: listingsCount, listings } = await getDealsListings({
        filters,
        options
      })

      setListings(listings)
      setCount(listingsCount)
    } catch (error) {
      console.error('error fetching deals listings', error)
      setListings([])
    }
  }, [options, filters])

  useEffect(() => {
    if (activeBrandId) {
      fetchDealsWithListings()
    }
  }, [activeBrandId, fetchDealsWithListings])

  return { count, listings }
}
