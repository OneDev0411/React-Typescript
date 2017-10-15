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
  user,
  listing,
  isWidget,
  onClickHandler,
  markerPopupIsActive,
  onMouseLeaveHandler,
  onMouseEnterHandler
}) => (
  <Link
    className={'single-marker'}
    onMouseLeave={onMouseLeaveHandler}
    onMouseEnter={onMouseEnterHandler}
    to={`/dashboard/mls/${listing.id}`}
    style={setMarkerCssPosition(listing)}
    target={user && !isWidget ? '' : '_blank'}
  >
    <ListingMarker
      data={data}
      context={'map'}
      listing={listing}
      popupIsActive={markerPopupIsActive}
    />
  </Link>
)

export default SimpleMarker
