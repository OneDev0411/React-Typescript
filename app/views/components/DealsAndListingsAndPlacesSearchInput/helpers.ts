import { getPlaces } from 'models/listings/search/get-places'
import { searchListings } from 'models/listings/search/search-listings'

import {
  ListingResult,
  PlaceResult,
  SearchResult,
  DealResult,
  SearchResultType
} from './types'

export async function searchDealsAndListingsAndPlaces(
  deals: Record<UUID, IDeal> | undefined,
  searchTypes: SearchResultType[],
  query: string
): Promise<SearchResult[]> {
  const hasDealSearchType = searchTypes.includes('deal')
  const hasListingSearchType = searchTypes.includes('listing')
  const hasPlaceSearchType = searchTypes.includes('place')

  let result: SearchResult[] = []

  if (hasDealSearchType) {
    const dealsResponse: IDeal[] = deals
      ? Object.values(deals).filter(
          (deal: IDeal) => deal.title.indexOf(query) > -1
        )
      : []

    result = [
      ...result,
      ...dealsResponse?.map<DealResult>(deal => ({
        type: 'deal',
        deal
      }))
    ]
  }

  if (hasListingSearchType) {
    const listingsResponse = await searchListings(query, { limit: 10 })

    result = [
      ...result,
      ...listingsResponse.data.map<ListingResult>(listing => ({
        type: 'listing',
        listing
      }))
    ]
  }

  if (hasPlaceSearchType) {
    const placesResponse = await getPlaces(query)

    result = [
      ...result,
      ...placesResponse.slice(0, 10).map<PlaceResult>(place => ({
        type: 'place',
        place
      }))
    ]
  }

  return result
}
