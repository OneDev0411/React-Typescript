import React from 'react'
import { Grid } from '@material-ui/core'

import ShowingCard from '../ShowingCard'

function ShowingList() {
  return (
    <Grid container spacing={2}>
      <Grid item xs={3}>
        <ShowingCard />
      </Grid>
      <Grid item xs={3}>
        <ShowingCard />
      </Grid>
      <Grid item xs={3}>
        <ShowingCard />
      </Grid>
      <Grid item xs={3}>
        <ShowingCard />
      </Grid>
    </Grid>
  )
}

export default ShowingList
