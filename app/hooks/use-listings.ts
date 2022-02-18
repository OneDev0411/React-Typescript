import { useState, useEffect } from 'react'

import { useUnsafeActiveBrandId } from '@app/hooks/brand/use-unsafe-active-brand-id'
import { getDealsListings } from '@app/models/listings/listing/get-deals-listings'
import {
  getBrandListings,
  GetBrandListingsOptions
} from '@app/models/listings/search/get-brand-listings'

export function useBrandListings(
  options?: GetBrandListingsOptions
): Nullable<ICompactListing[]> {
  const activeBrandId = useUnsafeActiveBrandId()
  const [listings, setListings] = useState<Nullable<ICompactListing[]>>(null)

  useEffect(() => {
    async function fetchBrandListings() {
      if (!activeBrandId) {
        return
      }

      try {
        const brandListings = await getBrandListings(activeBrandId, options)

        setListings(brandListings)
      } catch (error) {
        console.error('error fetching brand listings', error)
        setListings([])
      }
    }

    fetchBrandListings()
  }, [activeBrandId, options])

  return listings
}

export function useDealsListings(
  listingIdsToExclude?: UUID[]
): Nullable<IListing[]> {
  const activeBrandId = useUnsafeActiveBrandId()
  const [listings, setListings] = useState<Nullable<IListing[]>>(null)

  useEffect(() => {
    async function fetchDealsListings() {
      if (!listingIdsToExclude || !activeBrandId) {
        return
      }

      try {
        const dealsListings = await getDealsListings(activeBrandId)

        // We're removing duplicate listings that we already have them
        const uniqueDealsListings = dealsListings.filter(
          listing => !listingIdsToExclude.includes(listing.id)
        )

        setListings(uniqueDealsListings)
      } catch (error) {
        console.error('error fetching deals listings', error)
        setListings([])
      }
    }

    fetchDealsListings()
  }, [listingIdsToExclude, activeBrandId])

  return listings
}
