import { useMemo } from 'react'

import {
  useBrandListings,
  useBrandListingsCount,
  useDealsListings
} from '@app/hooks/use-listings'
import {
  GetBrandListingsFilters,
  GetBrandListingsOptions
} from '@app/models/listings/search/get-brand-listings'

type ListingRow = IListing | ICompactListing

const defaultRows: ListingRow[] = []

interface UseBrandAndDealsListings {
  isLoading: boolean
  count: number
  listings: ListingRow[]
}

interface UseBrandAndDealsListingsProperties {
  filters?: GetBrandListingsFilters
  options?: GetBrandListingsOptions
  withListingsCount?: boolean
}

const transformStatuses = (
  statuses: GetBrandListingsFilters['listing_statuses']
) =>
  statuses?.reduce(
    (previousValue, key) => ({
      ...previousValue,
      [`is_${key.toLowerCase()}`]: true
    }),
    {}
  )

const transformBrandFiltersToDeals = ({
  search,
  listing_statuses
}: GetBrandListingsFilters = {}) => ({
  search,
  status: transformStatuses(listing_statuses)
})

function useBrandAndDealsListings({
  filters,
  options,
  withListingsCount = false
}: UseBrandAndDealsListingsProperties = {}): UseBrandAndDealsListings {
  const brandListings = useBrandListings({ filters, options })
  const brandListingsCount = useBrandListingsCount({
    filters,
    isEnabled: withListingsCount
  })
  const brandListingsIds = useMemo(
    () => brandListings?.map(listing => listing.id),
    [brandListings]
  )
  const { listings: dealsListings, count: dealsListingsCount } =
    useDealsListings({
      filters: {
        ...transformBrandFiltersToDeals(filters),
        listingIdsToExclude: brandListingsIds
      },
      options
    })
  const listings = useMemo(
    () =>
      brandListings && dealsListings
        ? [...dealsListings, ...brandListings]
        : defaultRows,
    [brandListings, dealsListings]
  )

  return {
    isLoading: !brandListings || !dealsListings,
    count: Math.max(brandListingsCount, dealsListingsCount),
    listings
  }
}

export default useBrandAndDealsListings
