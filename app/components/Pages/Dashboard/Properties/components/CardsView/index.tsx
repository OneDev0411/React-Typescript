import { Grid, Box } from '@material-ui/core'

import { useListSelection } from 'components/ListSelection/use-list-selection'

import { toggleListingHoverState } from '../../ExploreTab/context/actions'
import useListingsContext from '../../ExploreTab/hooks/useListingsContext'
import ListingCard from '../ListingCardWithFavorite'

interface Props {
  listings: ICompactListing[]
  mapIsShown: boolean
  isWidget: boolean
}

export const CardsView = ({ listings, mapIsShown, isWidget }: Props) => {
  const { selections, toggleItem } = useListSelection()
  const [, dispatch] = useListingsContext()

  const handleToggleHoverState = (listingId: UUID) => {
    dispatch(toggleListingHoverState(listingId))
  }

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
              onToggleHoverState={handleToggleHoverState}
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
