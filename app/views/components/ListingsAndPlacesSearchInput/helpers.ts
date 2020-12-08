import { getPlaces } from 'models/listings/search/get-places'
import { searchListings } from 'models/listings/search/search-listings'

import { ListingResult, PlaceResult, SearchResult } from './types'

export async function searchListingsAndPlaces(
  query: string
): Promise<SearchResult[]> {
  const listingsResponse = await searchListings(query, { limit: 10 })
  const placesResponse = await getPlaces(query)

  return [
    ...listingsResponse.data.map<ListingResult>(listing => ({
      type: 'listing',
      listing
    })),
    ...placesResponse.slice(0, 10).map<PlaceResult>(place => ({
      type: 'place',
      place
    }))
  ]
}
