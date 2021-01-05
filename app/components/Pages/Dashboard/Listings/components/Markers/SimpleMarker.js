import React from 'react'
import ButtonBase from '@material-ui/core/ButtonBase'

import { ListingDetailsModal } from 'components/ListingDetailsModal'

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

const SimpleMarker = ({ listing }) => {
  const [isHoverd, setIsHoverd] = React.useState(false)
  const [isListingOpen, setIsListingOpen] = React.useState(false)

  const closeListing = () => {
    window.history.replaceState({}, '', '/dashboard/mls')
    setIsListingOpen(false)
  }

  const handleClick = React.useCallback(() => {
    window.history.replaceState({}, '', `/dashboard/mls/${listing.id}`)
    setIsListingOpen(true)
  }, [listing.id])

  return (
    <>
      <ButtonBase
        className="single-marker"
        onMouseLeave={() => setIsHoverd(false)}
        onMouseEnter={() => setIsHoverd(true)}
        onClick={handleClick}
        style={setMarkerCssPosition(listing)}
      >
        <ListingMarker
          context="map"
          listing={listing}
          popupIsActive={isHoverd}
        />
      </ButtonBase>
      <ListingDetailsModal
        isOpen={isListingOpen}
        listingId={listing.id}
        closeHandler={closeListing}
      />
    </>
  )
}
export default SimpleMarker
