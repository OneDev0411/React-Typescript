import { useState, useEffect } from 'react'

import uniqBy from 'lodash/uniqBy'
import { useSelector } from 'react-redux'
import { useDeepCompareEffect } from 'react-use'

import getListing from 'models/listings/listing/get-listing'
import {
  getBrandListings,
  GetBrandListingsOptions
} from 'models/listings/search/get-brand-listings'
import { IAppState } from 'reducers'

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

  const deals = useSelector<IAppState, Record<UUID, IDeal>>(
    state => state.deals.list
  )

  const isFetchingDeals = useSelector<IAppState, boolean>(
    state => state.deals.properties.isFetchingDeals
  )

  useDeepCompareEffect(() => {
    async function fetchDealsListings() {
      if (isFetchingDeals || !listingIdsToExclude) {
        return
      }

      const uniqDealListingIds = uniqBy(
        Object.values(deals),
        deal => deal.listing
      )
        .filter(
          deal =>
            deal.listing && !listingIdsToExclude.includes(deal.listing as UUID)
        )
        .map(deal => deal.listing)

      try {
        const dealsListings = await Promise.all(
          uniqDealListingIds.map(listingId => getListing(listingId as UUID))
        )

        setListings(dealsListings)
      } catch (error) {
        console.error('error fetching deals listings', error)
        setListings([])
      }
    }

    fetchDealsListings()
  }, [listingIdsToExclude, deals, isFetchingDeals])

  return listings
}
