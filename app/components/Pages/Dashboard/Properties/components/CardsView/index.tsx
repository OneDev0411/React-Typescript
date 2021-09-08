import { useCallback } from 'react'

import { Grid, Box } from '@material-ui/core'
import { useSelector } from 'react-redux'

import useNotify from '@app/hooks/use-notify'
import { useListSelection } from 'components/ListSelection/use-list-selection'
import api from 'models/listings/favorites'
import { selectUserUnsafe } from 'selectors/user'

import {
  changeListingHoverState,
  toggleListingFavoriteState
} from '../../ExploreTab/context/actions'
import useListingsContext from '../../ExploreTab/hooks/useListingsContext'
import ListingCard from '../ListingCardWithFavorite'

interface Props {
  listings: ICompactListing[]
  mapIsShown: boolean
  isWidget: boolean
}

export const CardsView = ({ listings, mapIsShown, isWidget }: Props) => {
  const { selections, toggleItem } = useListSelection()
  const [state, dispatch] = useListingsContext()
  const user = useSelector(selectUserUnsafe)
  const notify = useNotify()

  const handleChangeHoverState = useCallback(
    (listingId: UUID, hover: boolean) => {
      dispatch(changeListingHoverState(hover ? listingId : null))
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )

  const handleToggleLike = useCallback(
    async (listing: ICompactListing) => {
      if (!user) {
        return
      }

      dispatch(toggleListingFavoriteState(listing.id))

      try {
        await api.toggleFavorites({
          recId: null,
          mlsNumber: listing.mls_number,
          isFavorite: listing.favorited,
          roomId: user.personal_room
        })
      } catch {
        dispatch(toggleListingFavoriteState(listing.id))
        notify({
          status: 'error',
          message: 'Unable to perform this action.',
          options: { id: 'toggle-listing-favorite-error' }
        })
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [user]
  )

  const handleToggleSelection = useCallback(toggleItem, [toggleItem])

  return (
    <Grid container>
      {listings.map(listing => (
        <Grid
          item
          key={listing.id}
          md={mapIsShown ? 12 : 6}
          lg={mapIsShown ? 6 : 3}
        >
          <Box pb={1} pr={1} id={listing.id}>
            <ListingCard
              isWidget={isWidget}
              listing={listing}
              hover={state.listingStates.hover === listing.id}
              clicked={state.listingStates.click === listing.id}
              onChangeHoverState={handleChangeHoverState}
              reduxToggleFavorite={false} // TODO: remove this after refactoring fav/saved tab
              onToggleLike={() => {
                handleToggleLike(listing)
              }}
              selected={selections.some(
                (item: ICompactListing) => item.id === listing.id
              )}
              onToggleSelection={() => handleToggleSelection(listing)}
            />
          </Box>
        </Grid>
      ))}
    </Grid>
  )
}
