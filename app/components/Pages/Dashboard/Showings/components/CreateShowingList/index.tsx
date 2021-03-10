import React from 'react'

import { Box, Typography, Grid } from '@material-ui/core'

import CreateShowingCard from '../CreateShowingCard'

function CreateShowingList() {
  return (
    <Box mb={4}>
      <Typography>Create A New Showing</Typography>
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
    </Box>
  )
}

export default CreateShowingList
