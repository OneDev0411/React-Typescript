import { useCallback } from 'react'

import { Grid, makeStyles } from '@material-ui/core'
import cn from 'classnames'
import { useSelector } from 'react-redux'

import useNotify from '@app/hooks/use-notify'
import api from '@app/models/listings/favorites'
import { selectUserUnsafe } from '@app/selectors/user'
import { noop } from '@app/utils/helpers'
import { useListSelection } from '@app/views/components/ListSelection/use-list-selection'

import { IListingUIStates } from '../../types'
import ListingCard from '../ListingCardWithFavorite'

const useStyles = makeStyles(
  theme => ({
    root: {
      pointerEvents: 'unset'
    },
    isScroling: {
      pointerEvents: 'none'
    },
    listingContainer: {
      paddingBottom: theme.spacing(1),
      paddingRight: theme.spacing(1)
    }
  }),
  { name: 'CardsView' }
)

interface Props {
  listings: ICompactListing[]
  mapIsShown: boolean
  isWidget: boolean
  listingStates: IListingUIStates
  isScroling?: boolean
  onToggleLike?: (id: UUID) => void
  onChangeHoverState?: (id: UUID, hover: boolean) => void
}

export const CardsView = ({
  listings,
  mapIsShown,
  isWidget,
  listingStates,
  isScroling = false,
  onToggleLike = noop,
  onChangeHoverState = noop
}: Props) => {
  const classes = useStyles()

  const { selections, toggleItem } = useListSelection()
  const user = useSelector(selectUserUnsafe)
  const notify = useNotify()

  const handleToggleLike = useCallback(
    async (listing: ICompactListing, sendApiRequest = true) => {
      if (!user) {
        return
      }

      onToggleLike(listing.id)

      if (sendApiRequest) {
        try {
          await api.toggleFavorites({
            recId: null,
            mlsNumber: listing.mls_number,
            isFavorite: listing.favorited,
            roomId: user.personal_room
          })
        } catch {
          onToggleLike(listing.id)
          notify({
            status: 'error',
            message: 'Unable to perform this action.',
            options: { id: 'toggle-listing-favorite-error' }
          })
        }
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [user]
  )

  const handleToggleSelection = useCallback(toggleItem, [toggleItem])

  return (
    <Grid
      container
      className={cn({ [classes.root]: true, [classes.isScroling]: isScroling })}
    >
      {listings.map(listing => (
        <Grid
          item
          key={listing.id}
          md={mapIsShown ? 12 : 6}
          lg={mapIsShown ? 6 : 3}
        >
          <Grid className={classes.listingContainer} id={listing.id}>
            <ListingCard
              isWidget={isWidget}
              listing={listing}
              hover={listingStates.hover === listing.id}
              clicked={listingStates.click === listing.id}
              onChangeHoverState={onChangeHoverState}
              reduxToggleFavorite={false} // TODO: remove this after refactoring fav/saved tab
              onToggleLike={sendApiRequest =>
                handleToggleLike(listing, sendApiRequest)
              }
              selected={selections.some(
                (item: ICompactListing) => item.id === listing.id
              )}
              onToggleSelection={() => handleToggleSelection(listing)}
            />
          </Grid>
        </Grid>
      ))}
    </Grid>
  )
}
