import React from 'react'
import { Button, Grid, Typography } from '@material-ui/core'

interface Props {
  onSeeAllClick: () => void
}

export default function Listings({ onSeeAllClick }: Props) {
  return (
    <Grid container direction="row" justify="space-between">
      <Grid item>
        <Typography variant="h6">View Top Agents For Your Listings</Typography>
      </Grid>
      <Grid item>
        <Button variant="outlined" color="secondary" onClick={onSeeAllClick}>
          See All Your Listings
        </Button>
      </Grid>
    </Grid>
  )
}
