import { useMemo } from 'react'

import { useBrandListings, useDealsListings } from '@app/hooks/use-listings'

type ListingRow = IListing | ICompactListing

const defaultRows: ListingRow[] = []

interface UseBrandAndDealsListings {
  isLoading: boolean
  listings: ListingRow[]
}

function useBrandAndDealsListings(brandId: UUID): UseBrandAndDealsListings {
  const brandListings = useBrandListings(brandId)
  const brandListingsIds = useMemo(
    () => brandListings?.map(listing => listing.id),
    [brandListings]
  )
  const dealsListings = useDealsListings(brandListingsIds)

  const listings =
    brandListings && dealsListings
      ? [...dealsListings, ...brandListings]
      : defaultRows

  return {
    isLoading: !brandListings || !dealsListings,
    listings
  }
}

export default useBrandAndDealsListings
