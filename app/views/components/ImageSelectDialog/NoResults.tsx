import React, { ReactNode } from 'react'

import { Grid, Box, Typography } from '@material-ui/core'

interface Props {
  children?: ReactNode
}

export default function NoResults({ children }: Props) {
  return (
    <Grid container justifyContent="center">
      <Grid item>
        <Box py={3}>
          <Typography variant="body1">
            Nothing matches your search query. Please try searching something
            else.
          </Typography>
          {children}
        </Box>
      </Grid>
    </Grid>
  )
}
