import { useGetListing } from '@app/hooks/use-get-listing'
import { useQueryParam } from '@app/hooks/use-query-param'
import { useSearchLocation } from '@app/hooks/use-search-location'

export function useSearchAddress(criteria: string) {
  const [queryListingId] = useQueryParam('listingId')
  const { listing } = useGetListing(queryListingId)

  const { isSearching, listings, places, getParsedPlace } =
    useSearchLocation(criteria)

  return { isSearching, listing, listings, places, getParsedPlace }
}
