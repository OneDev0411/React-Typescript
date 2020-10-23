import { getPlaces } from 'models/listings/search/get-places'
import { searchListings } from 'models/listings/search/search-listings'

import { ListingResult, PlaceResult, SearchResult } from './types'

export async function searchListinsAndPlaces(
  query: string
): Promise<SearchResult[]> {
  const listingsResponse = await searchListings(query, { limit: 5 })
  const placesResponse = await getPlaces(query)

  return [
    ...listingsResponse.data.map<ListingResult>(listing => ({
      type: 'listing',
      listing
    })),
    ...placesResponse.map<PlaceResult>(place => ({
      type: 'place',
      place
    }))
  ]
}
