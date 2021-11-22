import { getPlace } from 'models/listings/search/get-place'
import { getMapBoundsInCircle } from 'utils/get-coordinates-points'

import {
  DEFAULT_SEARCH_RADIUS,
  ALL_PROPERTY_TYPES,
  ALL_PROPERTY_SUBTYPES
} from '../constants'

function getPastYearTimestamp() {
  return (new Date().getTime() - 365 * 24 * 3600000) / 1000
}

export async function getListingVAlertFilters(
  listing: IListing
): Promise<AlertFiltersWithRadiusAndCenter> {
  const pastYearTimestamp = getPastYearTimestamp()
  const place = await getPlace(listing.property.address.full_address)

  return {
    property_types: [listing.property.property_type],
    property_subtypes: [listing.property.property_subtype],
    minimum_bedrooms: listing.property.bedroom_count
      ? Math.max(listing.property.bedroom_count - 2, 0)
      : undefined,
    maximum_bedrooms: listing.property.bedroom_count
      ? listing.property.bedroom_count + 2
      : undefined,
    minimum_sold_date: pastYearTimestamp,
    points: getMapBoundsInCircle(place.center, DEFAULT_SEARCH_RADIUS),
    radius: DEFAULT_SEARCH_RADIUS,
    center: { latitude: place.center.lat, longitude: place.center.lng }
  }
}

export function getLocationVAlertFilters(
  location: google.maps.LatLngLiteral
): AlertFiltersWithRadiusAndCenter {
  const pastYearTimestamp = getPastYearTimestamp()

  return {
    property_types: ALL_PROPERTY_TYPES,
    property_subtypes: ALL_PROPERTY_SUBTYPES,
    points: getMapBoundsInCircle(location, DEFAULT_SEARCH_RADIUS),
    center: {
      latitude: location.lat,
      longitude: location.lng
    },
    radius: DEFAULT_SEARCH_RADIUS,
    minimum_sold_date: pastYearTimestamp
  }
}
