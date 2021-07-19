import { goTo } from 'utils/go-to'
import { SearchResult } from 'components/DealsAndListingsAndPlacesSearchInput/types'

export function openListingPage(listing: ICompactListing | IListing): void {
  const listingAddress =
    listing.type === 'compact_listing'
      ? listing.address
      : listing.property.address

  goTo('/dashboard/agent-network/agents', null, {
    listing: listing.id,
    title: listingAddress.street_address
  })
}

export function openPlacePage(place: google.maps.GeocoderResult): void {
  goTo('/dashboard/agent-network/agents', null, {
    lat: place.geometry.location.lat,
    lng: place.geometry.location.lng,
    title: place.formatted_address
  })
}

export function openSearchResultPage(result: SearchResult): void {
  if (result.type === 'listing') {
    openListingPage(result.listing)
  } else if (result.type === 'place') {
    openPlacePage(result.place)
  }
}
