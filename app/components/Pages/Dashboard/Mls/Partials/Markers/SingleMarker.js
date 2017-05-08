import React from 'react'
import ListingMarker from '../../../Partials/ListingMarker'


const singleMarkerStyle = ({
  left = 0,
  top = 0
}) => ({
  position: 'absolute',
  top,
  left
})

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
    style={list.position && singleMarkerStyle(list.position)}
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