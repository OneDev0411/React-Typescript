import { useCallback } from 'react'

import { Grid, Box } from '@material-ui/core'

import { useListSelection } from 'components/ListSelection/use-list-selection'

import { changeListingHoverState } from '../../ExploreTab/context/actions'
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

  const handleChangeHoverState = useCallback(
    (listingId: UUID, hover: boolean) => {
      dispatch(changeListingHoverState(hover ? listingId : null))
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )

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
              selected={selections.some(
                (item: ICompactListing) => item.id === listing.id
              )}
              onToggleSelection={() => toggleItem(listing)}
            />
          </Box>
        </Grid>
      ))}
    </Grid>
  )
}
