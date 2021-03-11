import React from 'react'

import { Grid } from '@material-ui/core'

import LiveShowingCard from '../LiveShowingCard'

function LiveShowingList() {
  return (
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
  )
}

export default LiveShowingList
