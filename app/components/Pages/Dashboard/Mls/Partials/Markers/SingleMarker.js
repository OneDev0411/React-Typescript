import React from 'react'
import ListingMarker from '../../../Partials/ListingMarker'


const singleMarkerStyle = (list) => {
  if (list.position) {
    const { left, top } = list.position
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

const SingleMarker = ({
  list,
  data,
  onClickHandler,
  markerPopupIsActive,
  onMouseLeaveHandler,
  onMouseEnterHandler
}) => (
  <div
    className={'single-marker'}
    onMouseLeave={onMouseLeaveHandler}
    onMouseEnter={onMouseEnterHandler}
    onClick={() => onClickHandler(list)}
    style={singleMarkerStyle(list)}
  >
    <ListingMarker
      data={data}
      listing={list}
      context={'map'}
      popupIsActive={markerPopupIsActive}
    />
  </div>
)

export default SingleMarker