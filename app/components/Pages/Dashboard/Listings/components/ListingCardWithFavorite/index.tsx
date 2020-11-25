import React, { ComponentProps, useCallback, useState, memo } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Dialog } from '@material-ui/core'
import LazyLoad from 'react-lazy-load'
import { noop } from 'lodash'

import toggleFavorite from 'actions/listings/favorites/toggle-favorite'
import { getIsFavorite } from 'reducers/listings/favorites'
import { IAppState } from 'reducers'

import ListingCard from 'components/ListingCards/ListingCard'

import Listing from '../../Listing'

interface Props
  extends Omit<ComponentProps<typeof ListingCard>, 'liked' | 'onLikeClick'> {}

const ListingCardWithFavorite = ({
  listing,
  tags,
  selected = undefined,
  onToggleSelection = noop,
  onClick
}: Props) => {
  const dispatch = useDispatch()
  const data = useSelector(({ data }) => data)
  const user = useSelector<IAppState, IUser>(({ user }) => user)
  const favorites = useSelector(({ favorites }) => favorites)
  const isFavorited = getIsFavorite(favorites.listings, listing.id)

  const [isListingOpen, setIsListingOpen] = useState<boolean>(false)

  const closeListing = () => {
    window.history.pushState({}, '', '/dashboard/mls')
    setIsListingOpen(false)
  }

  const handleClick = useCallback(() => {
    if (onClick) {
      onClick()

      return
    }

    window.history.pushState({}, '', `/dashboard/mls/${listing.id}`)
    setIsListingOpen(true)
  }, [onClick, listing.id])

  const handleToggleSelection = useCallback(onToggleSelection, [
    onToggleSelection
  ])

  const handleLikeClick = useCallback(() => {
    dispatch(toggleFavorite(listing))
  }, [dispatch, listing])

  return (
    <>
      <LazyLoad>
        <ListingCard
          listing={listing}
          selected={user ? selected : undefined}
          liked={user ? isFavorited : undefined}
          tags={tags}
          onClick={handleClick}
          onLikeClick={handleLikeClick}
          onToggleSelection={handleToggleSelection}
        />
      </LazyLoad>

      {isListingOpen && (
        <Dialog open fullScreen>
          <Listing
            style={{
              width: '100%',
              marginLeft: 0
            }}
            data={data}
            params={{
              id: listing.id
            }}
            onClose={closeListing}
          />
        </Dialog>
      )}
    </>
  )
}

export default memo(ListingCardWithFavorite)
