import { ComponentProps, useCallback, useState, memo } from 'react'

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
  // TODO: remove this after refactoring fav/saved tab
  // related to https://gitlab.com/rechat/web/-/issues/4864
  unselectOnToggleFavorite?: boolean
  onToggleListingModal?: (id: UUID, isOpen: boolean) => void
  onToggleLike?: (
    listing: IListing | ICompactListing,
    shouldSendApiRequest?: boolean
  ) => void
  onMouseEnter?: React.MouseEventHandler<HTMLDivElement>
  onMouseLeave?: React.MouseEventHandler<HTMLDivElement>
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
  unselectOnToggleFavorite = false,
  onToggleLike = noop,
  onClick,
  onToggleListingModal = noop,
  onMouseEnter,
  onMouseLeave
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

  // TODO: After refactoring saved tab, Change it to:
  const handleLikeClick = useCallback(
    (shouldSendApiRequest = true) => {
      if (selected && unselectOnToggleFavorite) {
        onToggleSelection(listing)
      }

      if (reduxToggleFavorite) {
        dispatch(toggleFavorite(listing))
      } else {
        onToggleLike(listing, shouldSendApiRequest)
      }
    },
    [
      selected,
      unselectOnToggleFavorite,
      reduxToggleFavorite,
      onToggleSelection,
      listing,
      onToggleLike,
      dispatch
    ]
  )

  return (
    <>
      <ListingCard
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        listing={listing}
        clicked={clicked}
        hover={hover}
        selected={user ? selected : undefined}
        liked={liked}
        tags={tags}
        onClick={handleClick}
        // TODO: After refactoring saved tab, Change it to:
        // onLikeClick={onToggleLike}
        onLikeClick={handleLikeClick}
        onToggleSelection={handleToggleSelection}
      />

      {isListingOpen && (
        <ListingDetailsModal
          isOpen
          isWidget={isWidget}
          listingId={listing.id}
          closeHandler={closeListing}
          onToggleFavorite={() => {
            // TODO: After refactoring saved tab, Change it to:
            // onToggleLike(listing, false)
            handleLikeClick(!reduxToggleFavorite)
          }}
        />
      )}
    </>
  )
}

export default memo(ListingCardWithFavorite)
