import React, { ComponentProps, useCallback, useState, memo } from 'react'

import { noop } from 'lodash'
import { useSelector, useDispatch } from 'react-redux'

import { selectListingIsFavorited } from '@app/selectors/listings'
import { selectUserUnsafe } from '@app/selectors/user'
import toggleFavorite from '@app/store_actions/listings/favorites/toggle-favorite'
import ListingCard from '@app/views/components/ListingCards/ListingCard'
import { ListingDetailsModal } from '@app/views/components/ListingDetailsModal'
import { IAppState } from 'reducers'

interface Props
  extends Omit<ComponentProps<typeof ListingCard>, 'liked' | 'onLikeClick'> {
  clicked?: boolean
  hover?: boolean
  isWidget?: boolean
  reduxToggleFavorite?: boolean // TODO: remove this after refactoring fav/saved tab
  onToggleListingModal?: (id: UUID, isOpen: boolean) => void
  onToggleLike?: (
    listing: IListing | ICompactListing,
    sendApiRequest?: boolean
  ) => void
}

const ListingCardWithFavorite = ({
  listing,
  isWidget = false,
  clicked = false,
  hover = false,
  tags,
  selected = undefined,
  onToggleSelection = noop,
  reduxToggleFavorite = true,
  onToggleLike = noop,
  onClick,
  onToggleListingModal = noop
}: Props) => {
  const dispatch = useDispatch()
  const user = useSelector(selectUserUnsafe)
  const [isListingOpen, setIsListingOpen] = useState<boolean>(false)

  // TODO: remove this after refactoring fav/saved tab
  const isFavoritedInRedux = useSelector((state: IAppState) =>
    selectListingIsFavorited(state, listing.id)
  )
  // TODO: After refactoring fav/saved tab, Change it to:
  // const liked = user ? listing.favorited : undefined
  const liked = user
    ? reduxToggleFavorite
      ? isFavoritedInRedux
      : listing.favorited
    : undefined

  const closeListing = useCallback(() => {
    setIsListingOpen(false)
    onToggleListingModal('', false)
  }, [onToggleListingModal])

  const handleClick = useCallback(() => {
    if (onClick) {
      onClick()

      return
    }

    setIsListingOpen(true)
    onToggleListingModal(listing.id, true)
  }, [onClick, onToggleListingModal, listing.id])

  const handleToggleSelection = useCallback(() => {
    onToggleSelection(listing)
  }, [onToggleSelection, listing])

  const handleLikeClick = useCallback(() => {
    if (selected) {
      onToggleSelection(listing)
    }

    dispatch(toggleFavorite(listing))
  }, [dispatch, listing, selected, onToggleSelection])

  console.log('ListingCardWithFavorite')

  return (
    <>
      <ListingCard
        listing={listing}
        clicked={clicked}
        hover={hover}
        selected={user ? selected : undefined}
        liked={liked}
        tags={tags}
        onClick={handleClick}
        // TODO: After refactoring fav/saved tab, Change it to:
        // onLikeClick={onToggleLike}
        onLikeClick={reduxToggleFavorite ? handleLikeClick : onToggleLike}
        onToggleSelection={handleToggleSelection}
      />

      {isListingOpen && (
        <ListingDetailsModal
          isOpen
          isWidget={isWidget}
          listingId={listing.id}
          closeHandler={closeListing}
          onToggleFavorite={() => {
            onToggleLike(listing, false)
          }}
        />
      )}
    </>
  )
}

export default memo(ListingCardWithFavorite)
