import { useState, useEffect } from 'react'

import { searchListings } from 'models/listings/search/search-listings'

import { useGoogleMapsPlaces } from './use-google-maps-places'

export function useSearchLocation(
  criteria: string
): {
  places: google.maps.places.AutocompletePrediction[]
  listings: ICompactListing[]
} {
  const [places, setPlaces] = useState<
    google.maps.places.AutocompletePrediction[]
  >([])
  const [listings, setListings] = useState<ICompactListing[]>([])

  useGoogleMapsPlaces()

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

  return {
    places,
    listings
  }
}
