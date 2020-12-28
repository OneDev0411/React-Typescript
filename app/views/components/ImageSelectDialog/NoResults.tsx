import React from 'react'
import { Grid, Box, Typography } from '@material-ui/core'

export default function NoResults() {
  return (
    <Grid container justify="center">
      <Grid item>
        <Box py={3}>
          <Typography variant="body1">
            Nothing matches your search query. Please try searching something
            else.
          </Typography>
        </Box>
      </Grid>
    </Grid>
  )
}
