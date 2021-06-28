import { useMemo } from 'react'
import { useSelector } from 'react-redux'

import { useBrandListings, useDealsListings } from '@app/hooks/use-listings'
import { selectActiveBrandId } from '@app/selectors/brand'

type ListingRow = IListing | ICompactListing

const defaultRows: ListingRow[] = []

interface UseActiveBrandListings {
  isLoading: boolean
  listings: ListingRow[]
}

function useActiveBrandListings(): UseActiveBrandListings {
  const brand = useSelector(selectActiveBrandId)

  const brandListings = useBrandListings(brand)
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

export default useActiveBrandListings
