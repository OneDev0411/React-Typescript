import React from 'react'
import { Grid, Box } from '@material-ui/core'

import { useShareAction } from 'components/ShareAction/use-share-action'

import LoadingComponent from '../../../../../../views/components/Spinner'

import ListingCard from '../ListingCard'
import ZeroState from '../ZeroState'

export default function GridView({ isFetching, sortedListings, user }) {
  const { selections, toggleItem } = useShareAction()

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
          user={user}
          selected={selections.some(item => item.id === listing.id)}
          onToggleSelection={toggleItem}
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
