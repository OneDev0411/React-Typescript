import React from 'react'

import { Grid } from '@material-ui/core'

import CreateShowingCard from '../CreateShowingCard'

function CreateShowingList() {
  return (
    <Grid container spacing={2}>
      <Grid item xs={3}>
        <CreateShowingCard />
      </Grid>
      <Grid item xs={3}>
        <CreateShowingCard />
      </Grid>
      <Grid item xs={3}>
        <CreateShowingCard />
      </Grid>
      <Grid item xs={3}>
        <CreateShowingCard />
      </Grid>
    </Grid>
  )
}

export default CreateShowingList
