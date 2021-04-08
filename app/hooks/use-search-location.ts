import { useState, useEffect } from 'react'
import addressParser from 'parse-address'

import { searchListings } from 'models/listings/search/search-listings'

import { useGoogleMapsPlaces } from './use-google-maps-places'

interface GoogleLocation {
  city: string
  number: string
  state: string
  street: string
  type: string
  zip: string
  unit: string
}

export function useSearchLocation(
  criteria: string
): {
  isSearching: boolean
  isEmptyState: boolean
  places: google.maps.places.AutocompletePrediction[]
  listings: ICompactListing[]
  getParsedPlace: (
    place: google.maps.places.AutocompletePrediction
  ) => Promise<GoogleLocation>
} {
  useGoogleMapsPlaces()

  const [places, setPlaces] = useState<
    google.maps.places.AutocompletePrediction[]
  >([])
  const [listings, setListings] = useState<ICompactListing[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [isEmptyState, setIsEmptyState] = useState(false)

  useEffect(() => {
    const searchPlaces = (): Promise<typeof places> => {
      return new Promise(resolve => {
        const { google } = window

        const service = new google.maps.places.AutocompleteService()

        let request = {
          input: criteria,
          componentRestrictions: { country: 'us' }
        }

        service.getPlacePredictions(request, (results, status) => {
          if (status != google.maps.places.PlacesServiceStatus.OK) {
            resolve([])
          } else {
            resolve(results)
          }
        })
      })
    }

    const searchMls = async () => {
      const listings = await searchListings(criteria, { limit: 5 })

      return listings.data
    }

    const search = async () => {
      if (criteria.length < 3) {
        setPlaces([])
        setListings([])
        setIsEmptyState(false)

        return
      }

      setIsSearching(true)
      setIsEmptyState(false)

      const [places, listings] = await Promise.all([
        searchPlaces(),
        searchMls()
      ])

      setIsSearching(false)
      setPlaces(places)
      setListings(listings)

      setIsEmptyState(places.length === 0 && listings.length === 0)
    }

    search()
  }, [criteria])

  /**
   *
   * @param place
   */
  const getParsedPlace = (
    place: google.maps.places.AutocompletePrediction
  ): Promise<GoogleLocation> => {
    return new Promise((resolve, reject) => {
      const service = new window.google.maps.places.PlacesService(
        document.createElement('div')
      )

      service.getDetails(
        {
          placeId: place!.place_id,
          fields: ['name', 'formatted_address', 'place_id', 'geometry']
        },
        async (place, status) => {
          if (status === window.google.maps.places.PlacesServiceStatus.OK) {
            const parsedAddress = await addressParser.parseLocation(
              place.formatted_address
            )

            resolve(parsedAddress)
          } else {
            reject()
          }
        }
      )
    })
  }

  return {
    isSearching,
    isEmptyState,
    places,
    listings,
    getParsedPlace
  }
}
