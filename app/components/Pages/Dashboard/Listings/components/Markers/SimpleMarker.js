import React from 'react'
import ButtonBase from '@material-ui/core/ButtonBase'
import { Dialog } from '@material-ui/core'

import { ListingDetails } from 'components/ListingDetails'

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
      {isListingOpen && (
        <Dialog open fullScreen>
          <ListingDetails id={listing.id} onClose={closeListing} />
        </Dialog>
      )}
    </>
  )
}
export default SimpleMarker
