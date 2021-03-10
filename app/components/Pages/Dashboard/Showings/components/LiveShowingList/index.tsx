import React from 'react'

import { Box, Typography, Grid } from '@material-ui/core'

import LiveShowingCard from '../LiveShowingCard'

function LiveShowingList() {
  return (
    <Box mb={4}>
      <Typography>Live Showings</Typography>
      <Grid container spacing={2}>
        <Grid item xs={3}>
          <LiveShowingCard />
        </Grid>
        <Grid item xs={3}>
          <LiveShowingCard />
        </Grid>
        <Grid item xs={3}>
          <LiveShowingCard />
        </Grid>
        <Grid item xs={3}>
          <LiveShowingCard />
        </Grid>
      </Grid>
    </Box>
  )
}

export default LiveShowingList
