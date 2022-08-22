import { useMemo } from 'react'

import { useBrandListings, useDealsListings } from '@app/hooks/use-listings'
import { GetBrandListingsOptions } from '@app/models/listings/search/get-brand-listings'

type ListingRow = IListing | ICompactListing

const defaultRows: ListingRow[] = []

interface UseBrandAndDealsListings {
  isLoading: boolean
  listings: ListingRow[]
}

function useBrandAndDealsListings(
  options?: GetBrandListingsOptions,
  limit?: number
): UseBrandAndDealsListings {
  const brandListings = useBrandListings(options, limit)
  const brandListingsIds = useMemo(
    () => brandListings?.map(listing => listing.id),
    [brandListings]
  )
  const dealsListings = useDealsListings(brandListingsIds, limit)

  const listings = useMemo(
    () =>
      brandListings && dealsListings
        ? [...dealsListings, ...brandListings]
        : defaultRows,
    [brandListings, dealsListings]
  )

  return {
    isLoading: !brandListings || !dealsListings,
    listings
  }
}

export default useBrandAndDealsListings
