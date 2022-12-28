import { useNavigate } from '@app/hooks/use-navigate'
import { SearchResult } from 'components/DealsAndListingsAndPlacesSearchInput/types'
// import { goTo } from 'utils/go-to'

export function OpenListingPage(listing: ICompactListing | IListing): void {
  const navigate = useNavigate()
  const listingAddress =
    listing.type === 'compact_listing'
      ? listing.address
      : listing.property.address

  navigate('/dashboard/agent-network/agents', {
    state: {
      listing: listing.id,
      title: listingAddress.street_address
    }
  })
}

export function OpenPlacePage(place: google.maps.GeocoderResult): void {
  const navigate = useNavigate()

  navigate('/dashboard/agent-network/agents', {
    state: {
      lat: place.geometry.location.lat,
      lng: place.geometry.location.lng,
      title: place.formatted_address
    }
  })
}

export function OpenSearchResultPage(result: SearchResult): void {
  if (result.type === 'listing') {
    OpenListingPage(result.listing)
  } else if (result.type === 'location') {
    OpenPlacePage(result.location)
  }
}
