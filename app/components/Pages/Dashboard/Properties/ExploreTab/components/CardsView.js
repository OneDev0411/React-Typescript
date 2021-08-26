import React from 'react'

import { Grid, Box } from '@material-ui/core'

import { Card } from './Card'

export const CardsView = ({ result, mapIsShown }) => {
  return (
    <Grid container>
      {result.listings.map(listing => (
        <Grid
          item
          key={listing.id}
          md={mapIsShown ? 12 : 6}
          lg={mapIsShown ? 6 : 3}
        >
          <Box pb={1} pr={1}>
            <Card listing={listing} />
          </Box>
        </Grid>
      ))}
    </Grid>
  )
}
