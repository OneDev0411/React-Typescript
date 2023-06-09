import { getPlaces } from '@app/models/listings/search/get-places'
import { searchListings } from 'models/listings/search/search-listings'

import {
  ListingResult,
  PlaceResult,
  LocationResult,
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
  const hasLocationSearchType = searchTypes.includes('location')

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
    const searchPlaces = (
      input: string
    ): Promise<google.maps.places.AutocompletePrediction[]> => {
      return new Promise(resolve => {
        const { google } = window

        const service = new google.maps.places.AutocompleteService()

        let request = {
          input,
          componentRestrictions: { country: 'us' }
        }

        service.getPlacePredictions(request, (results, status) => {
          if (status != google.maps.places.PlacesServiceStatus.OK) {
            resolve([])
          } else {
            resolve(results!)
          }
        })
      })
    }

    const placesResponse = await searchPlaces(query)

    result = [
      ...result,
      ...placesResponse.slice(0, 10).map<PlaceResult>(place => ({
        type: 'place',
        place
      }))
    ]
    // we can only show one type from location and place
  } else if (hasLocationSearchType) {
    const locationResponse = await getPlaces(query)

    result = [
      ...result,
      ...locationResponse.slice(0, 10).map<LocationResult>(location => ({
        type: 'location',
        location
      }))
    ]
  }

  return result
}

export const sortOptionsBySearchTypesList = (
  a: SearchResult,
  b: SearchResult,
  searchTypes: SearchResultType[]
): number => {
  return searchTypes.indexOf(a.type) - searchTypes.indexOf(b.type)
}
