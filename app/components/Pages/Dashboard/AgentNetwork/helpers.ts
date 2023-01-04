import { SearchResult } from 'components/DealsAndListingsAndPlacesSearchInput/types'

export function toListingPage(listing: ICompactListing | IListing) {
  const listingAddress =
    listing.type === 'compact_listing'
      ? listing.address
      : listing.property.address

  const state = {
    listing: listing.id,
    title: listingAddress.street_address
  }

  return state
}

export function toPlacePage(place: google.maps.GeocoderResult) {
  const state = {
    lat: place.geometry.location.lat,
    lng: place.geometry.location.lng,
    title: place.formatted_address
  }

  return state
}

export function toSearchResultPage(result: SearchResult) {
  if (result.type === 'listing') {
    toListingPage(result.listing)
  } else if (result.type === 'location') {
    toPlacePage(result.location)
  }
}
