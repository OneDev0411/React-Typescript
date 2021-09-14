import React, { ComponentProps, useCallback, useState, memo } from 'react'

import { noop } from 'lodash'
import { useSelector, useDispatch } from 'react-redux'

import toggleFavorite from 'actions/listings/favorites/toggle-favorite'
import ListingCard from 'components/ListingCards/ListingCard'
import { ListingDetailsModal } from 'components/ListingDetailsModal'
import { IAppState } from 'reducers'
import { selectListingIsFavorited } from 'selectors/listings'
import { selectUserUnsafe } from 'selectors/user'

interface Props
  extends Omit<ComponentProps<typeof ListingCard>, 'liked' | 'onLikeClick'> {
  isWidget?: boolean
}

const ListingCardWithFavorite = ({
  listing,
  isWidget = false,
  tags,
  selected = undefined,
  onToggleSelection = noop,
  onClick
}: Props) => {
  const dispatch = useDispatch()
  const user = useSelector(selectUserUnsafe)
  const isFavorited = useSelector((state: IAppState) =>
    selectListingIsFavorited(state, listing.id)
  )
  const [isListingOpen, setIsListingOpen] = useState<boolean>(false)

  const closeListing = () => {
    if (!isWidget) {
      window.history.pushState({}, '', '/dashboard/mls')
    }

    setIsListingOpen(false)
  }

  const handleClick = useCallback(() => {
    if (onClick) {
      onClick()

      return
    }

    if (!isWidget) {
      window.history.pushState({}, '', `/dashboard/mls/${listing.id}`)
    }

    setIsListingOpen(true)
  }, [onClick, listing.id, isWidget])

  const handleToggleSelection = useCallback(onToggleSelection, [
    onToggleSelection
  ])

  const handleLikeClick = useCallback(() => {
    if (selected) {
      onToggleSelection()
    }

    dispatch(toggleFavorite(listing))
  }, [dispatch, listing, selected, onToggleSelection])

  return (
    <>
      <ListingCard
        listing={listing}
        selected={user ? selected : undefined}
        liked={user ? isFavorited : undefined}
        tags={tags}
        onClick={handleClick}
        onLikeClick={handleLikeClick}
        onToggleSelection={handleToggleSelection}
      />

      <ListingDetailsModal
        isOpen={isListingOpen}
        isWidget={isWidget}
        listingId={listing.id}
        closeHandler={closeListing}
      />
    </>
  )
}

export default memo(ListingCardWithFavorite)
