import React from 'react'
import { Button, Grid, Box, Typography } from '@material-ui/core'

import CompactListingCard from 'components/ListingCards/CompactListingCard'
import LoadingContainer from 'components/LoadingContainer'

interface Props {
  isLoading: boolean
  listings: Nullable<ICompactListing[]>
  onListingClick: (listing: ICompactListing) => void
  onSeeAllClick: () => void
}

export default function Listings({
  isLoading,
  listings,
  onListingClick,
  onSeeAllClick
}: Props) {
  return (
    <>
      <Grid container direction="row" justify="space-between">
        <Grid item>
          <Typography variant="h6">
            View Top Agents For Your Listings
          </Typography>
        </Grid>
        <Grid item>
          <Button variant="outlined" color="secondary" onClick={onSeeAllClick}>
            See All Your Listings
          </Button>
        </Grid>
      </Grid>
      <Box py={2}>
        <Grid container spacing={3}>
          {isLoading && (
            <Grid container item xs alignItems="center" justify="center">
              <LoadingContainer noPaddings />
            </Grid>
          )}
          {listings?.map(listing => (
            <Grid key={listing.id} container item xs={12} sm={6} md={4}>
              <CompactListingCard
                listing={listing}
                onClick={() => onListingClick(listing)}
              />
            </Grid>
          ))}
          {listings?.length === 0 && (
            <Grid container item xs alignItems="center" justify="center">
              <Typography variant="h2">
                You don't have any listing to use.
              </Typography>
            </Grid>
          )}
        </Grid>
      </Box>
    </>
  )
}
