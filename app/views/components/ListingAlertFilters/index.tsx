import React from 'react'

import {
  Button,
  Grid,
  Box,
  Paper,
  Typography,
  makeStyles,
  Divider
} from '@material-ui/core'

const useStyles = makeStyles(
  () => ({
    title: {
      flexGrow: 1
    }
  }),
  {
    name: 'ListingAlertFilters'
  }
)

interface Props {
  title?: string
  filters: AlertFilters
  onChange: (filters: AlertFilters) => void
}

export default function ListingAlertFilters({
  title = 'Filters',
  filters
}: Props) {
  const classes = useStyles()

  return (
    <Paper>
      <Box my={2} mx={3}>
        <Grid container direction="column">
          <Grid
            container
            spacing={1}
            direction="row"
            justify="space-between"
            alignItems="center"
          >
            <Grid item className={classes.title}>
              <Typography variant="subtitle1">{title}</Typography>
            </Grid>
            <Grid item>
              <Button variant="text">Reset</Button>
            </Grid>
            <Grid item>
              <Button variant="contained" color="secondary">
                Apply (3)
              </Button>
            </Grid>
          </Grid>
          <Grid item>
            <Box py={1}>
              <Divider />
            </Box>
          </Grid>
          <Grid item>
            <pre>{JSON.stringify(filters, null, 2)}</pre>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  )
}
