import React from 'react'
import controller from '../../../controller'
import ListingMarker from '../../../Partials/ListingMarker'


const style = ({ left = 0, top = 0 }) => ({
  position: 'absolute',
  width: '45px',
  height: '25px',
  top,
  left,
  cursor: 'pointer'
})

export default function SingleMarker({
  list,
  data,
  markerPopupIsActive,
  onMouseLeaveHandler,
  onMouseEnterHandler
}) {
  return (
    <div
      onMouseLeave={onMouseLeaveHandler}
      onMouseEnter={onMouseEnterHandler}
      style={list.position && style(list.position)}
      onClick={controller.listing_viewer.showListingViewer.bind(this, list)}
    >
      <ListingMarker
        data={data}
        listing={list}
        context={'map'}
        popupIsActive={markerPopupIsActive}
      />
    </div>
  )
}