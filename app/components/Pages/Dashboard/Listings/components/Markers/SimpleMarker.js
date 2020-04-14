import React, { useState } from 'react'
import { Link } from 'react-router'

import ListingMarker from '../../../Partials/ListingMarker'

const setMarkerCssPosition = listing => {
  if (listing.cssPosition) {
    const { left, top } = listing.cssPosition

    return {
      position: 'absolute',
      top,
      left
    }
  }

  return {
    position: 'absolute',
    top: 0,
    left: 0
  }
}

const SimpleMarker = ({ data, user, listing, isWidget }) => {
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
      <ListingMarker
        data={data}
        context="map"
        listing={listing}
        popupIsActive={isHoverd}
      />
    </Link>
  )
}
export default SimpleMarker
