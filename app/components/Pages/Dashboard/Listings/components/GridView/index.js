import React from 'react'
import { Grid, Box } from '@material-ui/core'

import LoadingComponent from '../../../../../../views/components/Spinner'

import ListingCard from '../ListingCard'

export default function GridView({ isFetching, sortedListings, user }) {
  const renderContent = () => {
    if (isFetching) {
      return <LoadingComponent />
    }

    return sortedListings.map(listing => (
      <Grid key={listing.id} item xs={12} sm={12} md={6} lg={4} xl={3}>
        <ListingCard listing={listing} user={user} />
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
