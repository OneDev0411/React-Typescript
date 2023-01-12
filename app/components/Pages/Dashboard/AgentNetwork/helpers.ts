import { NavigateFunction } from '@app/hooks/use-navigate'

export function toListingPage(
  listing: ICompactListing | IListing
): Parameters<NavigateFunction> {
  const listingAddress =
    listing.type === 'compact_listing'
      ? listing.address
      : listing.property.address

  const searchParams = new URLSearchParams({
    listing: listing.id,
    title: listingAddress.street_address
  })

  return [
    {
      pathname: '/dashboard/agent-network/agents',
      search: searchParams.toString()
    }
  ]
}

export function toPlacePage(
  place: google.maps.GeocoderResult
): Parameters<NavigateFunction> {
  const searchParams = new URLSearchParams({
    lat: place.geometry.location.lat.toString(),
    lng: place.geometry.location.lng.toString(),
    title: place.formatted_address
  })

  return [
    {
      pathname: '/dashboard/agent-network/agents',
      search: searchParams.toString()
    }
  ]
}
