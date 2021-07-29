import { useEffect, useState } from 'react'

import { useQueryParam } from '@app/hooks/use-query-param'
import { useSearchLocation } from '@app/hooks/use-search-location'
import getListing from '@app/models/listings/listing/get-listing'

export function useSearchAddress(criteria: string) {
  const [listing, setListing] = useState<IListing | null>(null)
  const [queryListingId] = useQueryParam('listingId')

  const listingId = listing?.id

  useEffect(() => {
    const fetch = async () => {
      try {
        const listing = await getListing(queryListingId)

        setListing(listing)
      } catch (e) {
        console.log(e)
      }
    }

    if (queryListingId && !listingId) {
      fetch()
    }
  }, [queryListingId, listingId])

  const { isSearching, listings, places, getParsedPlace } =
    useSearchLocation(criteria)

  return { isSearching, listing, listings, places, getParsedPlace }
}
