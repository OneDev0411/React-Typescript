import React, { memo } from 'react'
import { Grid, Box } from '@material-ui/core'

import { useListSelection } from 'components/ListSelection/use-list-selection'

import ListingCard from '../ListingCardWithFavorite'

import LoadingComponent from '../../../../../../views/components/Spinner'

import ZeroState from '../ZeroState'

function GridView({ isFetching, sortedListings }) {
  const { selections, toggleItem } = useListSelection()

  const renderContent = () => {
    if (isFetching) {
      return <LoadingComponent />
    }

    if (!sortedListings.length) {
      return <ZeroState />
    }

    return sortedListings.map(listing => (
      <Grid key={listing.id} item xs={12} sm={12} md={6} lg={4} xl={3}>
        <ListingCard
          listing={listing}
          tags={listing.new ? [listing.new] : undefined}
          selected={selections.some(item => item.id === listing.id)}
          onToggleSelection={() => toggleItem(listing)}
        />
      </Grid>
    ))
  }

  return (
    <Box py={1}>
      <Grid container spacing={2}>
        {renderContent()}
      </Grid>
    </Box>
  )
}

export default memo(GridView)
