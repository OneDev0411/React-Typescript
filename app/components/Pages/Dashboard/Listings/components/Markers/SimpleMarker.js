import React from 'react'
import { Link } from 'react-router'

import ListingMarker from '../../../Partials/ListingMarker'

const setMarkerCssPosition = listing => {
  const position = {
    position,
    top: 0,
    left: 0
  }

  if (listing.cssPosition) {
    const { left, top } = listing.cssPosition

    return {
      ...position,
      top,
      left
    }
  }

  return position
}

const SimpleMarker = ({
  user,
  brand,
  listing,
  isWidget,
  markerPopupIsActive,
  onMouseLeaveHandler,
  onMouseEnterHandler
}) => (
  <Link
    className="single-marker"
    onMouseLeave={onMouseLeaveHandler}
    onMouseEnter={onMouseEnterHandler}
    to={`/dashboard/mls/${listing.id}`}
    style={setMarkerCssPosition(listing)}
    target={user && !isWidget ? '' : '_blank'}
  >
    <ListingMarker
      user={user}
      brand={brand}
      listing={listing}
      popupIsActive={markerPopupIsActive}
    />
  </Link>
)

export default SimpleMarker
