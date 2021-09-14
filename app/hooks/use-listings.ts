import { useState, useEffect } from 'react'

import { useSelector } from 'react-redux'

import { getDealsListings } from '@app/models/listings/listing/get-deals-listings'
import {
  getBrandListings,
  GetBrandListingsOptions
} from '@app/models/listings/search/get-brand-listings'
import { selectActiveBrandId } from '@app/selectors/brand'

export function useBrandListings(
  brand: Nullable<UUID>,
  options?: GetBrandListingsOptions
): Nullable<ICompactListing[]> {
  const [listings, setListings] = useState<Nullable<ICompactListing[]>>(null)

  useEffect(() => {
    async function fetchBrandListings() {
      if (!brand) {
        return
      }

      try {
        const brandListings = await getBrandListings(brand, options)

        setListings(brandListings)
      } catch (error) {
        console.error('error fetching brand listings', error)
        setListings([])
      }
    }

    fetchBrandListings()
  }, [brand, options])

  return listings
}

export function useDealsListings(
  listingIdsToExclude?: UUID[]
): Nullable<IListing[]> {
  const [listings, setListings] = useState<Nullable<IListing[]>>(null)

  const brandId = useSelector(selectActiveBrandId)

  useEffect(() => {
    async function fetchDealsListings() {
      if (!listingIdsToExclude) {
        return
      }

      try {
        const dealsListings = await getDealsListings(brandId)

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
  }, [listingIdsToExclude, brandId])

  return listings
}
