import { useState, useEffect, useRef } from 'react'
import addressParser from 'parse-address'

import { searchListings } from 'models/listings/search/search-listings'

import { useGoogleMapsPlaces } from './use-google-maps-places'

export function useSearchLocation(
  criteria: string
): {
  places: google.maps.places.AutocompletePrediction[]
  listings: ICompactListing[]
  getParsedPlace: (
    place: google.maps.places.AutocompletePrediction
  ) => Promise<unknown>
} {
  useGoogleMapsPlaces()

  const [places, setPlaces] = useState<
    google.maps.places.AutocompletePrediction[]
  >([])
  const [listings, setListings] = useState<ICompactListing[]>([])

  useEffect(() => {
    const searchPlaces = () => {
      const { google } = window

      const service = new google.maps.places.AutocompleteService()

      let request = {
        input: criteria,
        componentRestrictions: { country: 'us' }
      }

      service.getPlacePredictions(request, (results, status) => {
        if (status != google.maps.places.PlacesServiceStatus.OK) {
          setPlaces([])
        } else {
          setPlaces(results)
        }
      })
    }

    const searchMls = async () => {
      const listings = await searchListings(criteria, { limit: 5 })

      setListings(listings.data)
    }

    const search = async () => {
      if (criteria.length === 0) {
        setPlaces([])
        setListings([])

        return
      }

      if (criteria.length <= 3) {
        return
      }

      searchPlaces()
      searchMls()
    }

    search()
  }, [criteria])

  /**
   *
   * @param place
   */
  const getParsedPlace = (place: google.maps.places.AutocompletePrediction) => {
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
    places,
    listings,
    getParsedPlace
  }
}
