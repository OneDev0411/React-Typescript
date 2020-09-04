import React, { useState } from 'react'
import { Link } from 'react-router'

import ListingMarker from '../ListingMarker'

const setMarkerCssPosition = listing => {
  const position = {
    position: 'absolute',
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

const SimpleMarker = ({ user, listing, isWidget }) => {
  const [isHoverd, setIsHoverd] = useState(false)

  return (
    <Link
      className="single-marker"
      onMouseLeave={() => setIsHoverd(false)}
      onMouseEnter={() => setIsHoverd(true)}
      to={`/dashboard/mls/${listing.id}`}
      style={setMarkerCssPosition(listing)}
      target={user && !isWidget ? '' : '_blank'}
    >
      <ListingMarker context="map" listing={listing} popupIsActive={isHoverd} />
    </Link>
  )
}
export default SimpleMarker
