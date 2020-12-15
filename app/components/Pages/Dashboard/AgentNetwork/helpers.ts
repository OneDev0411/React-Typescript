import { goTo } from 'utils/go-to'
import { SearchResult } from 'components/ListingsAndPlacesSearchInput/types'

export function openListingPage(listing: ICompactListing): void {
  goTo('/dashboard/agent-network/agents', null, {
    listing: listing.id,
    title: listing.address.street_address
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

    return
  }

  openPlacePage(result.place)
}
