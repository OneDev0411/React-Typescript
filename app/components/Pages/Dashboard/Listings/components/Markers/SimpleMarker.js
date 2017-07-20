import React from 'react'
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

const SimpleMarker = ({
  data,
  listing,
  onClickHandler,
  markerPopupIsActive,
  onMouseLeaveHandler,
  onMouseEnterHandler
}) =>
  <Link
    to={`/dashboard/mls/${listing.id}`}
    target={data.user ? '' : '_blank'}
    onMouseLeave={onMouseLeaveHandler}
    onMouseEnter={onMouseEnterHandler}
    style={setMarkerCssPosition(listing)}
    className={'single-marker'}
  >
    <ListingMarker
      data={data}
      context={'map'}
      listing={listing}
      popupIsActive={markerPopupIsActive}
    />
  </Link>

export default SimpleMarker
