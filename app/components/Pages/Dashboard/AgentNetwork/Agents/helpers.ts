import { getPlace } from 'models/listings/search/get-place'
import { getMapBoundsInCircle } from 'utils/get-coordinates-points'

import {
  DEFAULT_SEARCH_RADIUS,
  DEFAULT_SEARCH_RESULT_LIMIT,
  ALL_PROPERTY_TYPES,
  ALL_PROPERTY_SUBTYPES
} from '../constants'

function getSixMonthsAgoTimestamp() {
  return (new Date().getTime() - 180 * 24 * 3600000) / 1000
}

export async function getListingVAlertFilters(
  listing: IListing
): Promise<AlertFiltersWithRadiusAndCenter> {
  const sixMonthsAgoTimestamp = getSixMonthsAgoTimestamp()
  const place = await getPlace(listing.property.address.full_address)

  return {
    property_types: [listing.property.property_type],
    property_subtypes: [listing.property.property_subtype],
    minimum_bedrooms: listing.property.bedroom_count,
    maximum_bedrooms: listing.property.bedroom_count,
    minimum_bathrooms: listing.property.full_bathroom_count,
    maximum_bathrooms: listing.property.full_bathroom_count,
    minimum_sold_date: sixMonthsAgoTimestamp,
    points: getMapBoundsInCircle(place.center, DEFAULT_SEARCH_RADIUS),
    radius: DEFAULT_SEARCH_RADIUS,
    center: { latitude: place.center.lat, longitude: place.center.lng },
    limit: DEFAULT_SEARCH_RESULT_LIMIT
  }
}

export function getLocationVAlertFilters(
  location: google.maps.LatLngLiteral
): AlertFiltersWithRadiusAndCenter {
  const sixMonthsAgoTimestamp = getSixMonthsAgoTimestamp()

  return {
    property_types: ALL_PROPERTY_TYPES,
    property_subtypes: ALL_PROPERTY_SUBTYPES,
    points: getMapBoundsInCircle(location, DEFAULT_SEARCH_RADIUS),
    center: {
      latitude: location.lat,
      longitude: location.lng
    },
    radius: DEFAULT_SEARCH_RADIUS,
    minimum_sold_date: sixMonthsAgoTimestamp,
    limit: DEFAULT_SEARCH_RESULT_LIMIT
  }
}
