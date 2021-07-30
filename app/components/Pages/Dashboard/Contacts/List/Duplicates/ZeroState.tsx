import React from 'react'

import { Grid, Typography } from '@material-ui/core'

export default function ZeroState() {
  return (
    <Grid
      container
      item
      direction="column"
      justifyContent="center"
      alignItems="center"
      style={{ height: '50vh' }}
    >
      <img
        src="/static/images/contacts/zero-state.svg"
        alt="houston"
        style={{ marginBottom: '1rem' }}
      />
      <Typography variant="h5">You have no duplicate contacts here.</Typography>
    </Grid>
  )
}
