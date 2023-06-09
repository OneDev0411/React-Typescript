import React from 'react'

import ButtonBase from '@material-ui/core/ButtonBase'
import { useDispatch } from 'react-redux'

import { useNavigate } from '@app/hooks/use-navigate'
import toggleFavorite from '@app/store_actions/listings/favorites/toggle-favorite'
import { changeUrl } from '@app/utils/change-url'
import { ListingDetailsModal } from '@app/views/components/ListingDetailsModal'

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

const SimpleMarker = ({ listing, isWidget }) => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [isHovered, setIsHovered] = React.useState(false)
  const [isListingOpen, setIsListingOpen] = React.useState(false)

  const closeListing = () => {
    if (!isWidget) {
      navigate(-1)
    }

    setIsListingOpen(false)
  }

  const handleClick = React.useCallback(() => {
    if (!isWidget) {
      changeUrl(`/dashboard/mls/${listing.id}`)
    }

    setIsListingOpen(true)
  }, [listing.id, isWidget])

  const handleLikeClick = () => {
    dispatch(toggleFavorite(listing))
  }

  return (
    <>
      <ButtonBase
        className="single-marker"
        onMouseLeave={() => setIsHovered(false)}
        onMouseEnter={() => setIsHovered(true)}
        onClick={handleClick}
        style={setMarkerCssPosition(listing)}
      >
        <ListingMarker
          context="map"
          listing={listing}
          popupIsActive={isHovered}
        />
      </ButtonBase>
      <ListingDetailsModal
        isWidget={!!isWidget}
        isOpen={isListingOpen}
        listingId={listing.id}
        closeHandler={closeListing}
        onToggleFavorite={handleLikeClick}
      />
    </>
  )
}
export default SimpleMarker
