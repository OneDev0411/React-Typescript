import { isLeaseProperty } from '@app/utils/listing'
import { getPlace } from 'models/listings/search/get-place'
import { getMapBoundsInCircle } from 'utils/get-coordinates-points'

import {
  DEFAULT_SEARCH_RADIUS,
  DEFAULT_SEARCH_MONTHS_PERIOD
} from '../constants'

function getPastMonthsTimestamp(months: number) {
  const now = new Date()
  const past = new Date()

  past.setMonth(now.getMonth() - months)

  return past.getTime() / 1000
}

async function getListingLatLng(
  listing: IListing
): Promise<google.maps.LatLngLiteral> {
  if (
    !listing.property.address.location.latitude ||
    !listing.property.address.location.longitude
  ) {
    const place = await getPlace(listing.property.address.full_address)

    return {
      lat: place.center.lat,
      lng: place.center.lng
    }
  }

  return {
    lat: listing.property.address.location.latitude,
    lng: listing.property.address.location.longitude
  }
}

export async function getListingVAlertFilters(
  listing: IListing
): Promise<AlertFiltersWithRadiusAndCenter> {
  const minimumSoldDate = getPastMonthsTimestamp(DEFAULT_SEARCH_MONTHS_PERIOD)
  const { lat, lng } = await getListingLatLng(listing)

  return {
    property_types: isLeaseProperty(listing)
      ? undefined
      : [listing.property.property_type],
    minimum_bedrooms: listing.property.bedroom_count
      ? Math.max(listing.property.bedroom_count - 2, 0)
      : undefined,
    maximum_bedrooms: listing.property.bedroom_count
      ? listing.property.bedroom_count + 2
      : undefined,
    minimum_sold_date: minimumSoldDate,
    points: getMapBoundsInCircle({ lat, lng }, DEFAULT_SEARCH_RADIUS),
    radius: DEFAULT_SEARCH_RADIUS,
    center: { latitude: lat, longitude: lng }
  }
}

export function getLocationVAlertFilters(
  location: google.maps.LatLngLiteral
): AlertFiltersWithRadiusAndCenter {
  const minimumSoldDate = getPastMonthsTimestamp(DEFAULT_SEARCH_MONTHS_PERIOD)

  return {
    points: getMapBoundsInCircle(location, DEFAULT_SEARCH_RADIUS),
    center: {
      latitude: location.lat,
      longitude: location.lng
    },
    radius: DEFAULT_SEARCH_RADIUS,
    minimum_sold_date: minimumSoldDate
  }
}
