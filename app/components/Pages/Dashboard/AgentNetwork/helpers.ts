import { NavigateFunction } from '@app/hooks/use-navigate'

export function toListingPage(
  listing: ICompactListing | IListing
): Parameters<NavigateFunction> {
  const listingAddress =
    listing.type === 'compact_listing'
      ? listing.address
      : listing.property.address

  return [
    '/dashboard/agent-network/agents',
    {
      state: {
        listing: listing.id,
        title: listingAddress.street_address
      }
    }
  ]
}

export function toPlacePage(
  place: google.maps.GeocoderResult
): Parameters<NavigateFunction> {
  return [
    '/dashboard/agent-network/agents',
    {
      state: {
        lat: place.geometry.location.lat,
        lng: place.geometry.location.lng,
        title: place.formatted_address
      }
    }
  ]
}

// export function toSearchResultPage(result: SearchResult) {
//   if (result.type === 'listing') {
//     toListingPage(result.listing)
//   }

//   if (result.type === 'location') {
//     toPlacePage(result.location)
//   }
// }
